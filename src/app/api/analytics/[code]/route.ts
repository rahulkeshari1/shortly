import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import pool from "@/lib/db";

type ClickLog = {
  id: number;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  clicked_at: Date;
};

function parseBrowser(userAgent: string | null) {
  const ua = userAgent || "";

  if (/Edg\//i.test(ua)) return "Edge";
  if (/OPR\//i.test(ua)) return "Opera";
  if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) return "Chrome";
  if (/Firefox\//i.test(ua)) return "Firefox";
  if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) return "Safari";
  if (/MSIE|Trident/i.test(ua)) return "Internet Explorer";

  return "Other";
}

function parseOS(userAgent: string | null) {
  const ua = userAgent || "";

  if (/Windows NT/i.test(ua)) return "Windows";
  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Mac OS X/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua)) return "Linux";
  if (/CrOS/i.test(ua)) return "ChromeOS";

  return "Other";
}

function parseDevice(userAgent: string | null) {
  const ua = userAgent || "";

  if (/iPad|Tablet/i.test(ua)) return "Tablet";
  if (/Mobile|Android|iPhone|iPod/i.test(ua)) return "Mobile";

  return "Desktop";
}

function getReferrer(referrer: string | null) {
  if (!referrer) return "Direct";

  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "Other";
  }
}

function maskIp(ip: string | null) {
  if (!ip) return "Unknown";

  if (ip.includes(".")) {
    const parts = ip.split(".");

    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.***.***`;
    }
  }

  if (ip.includes(":")) {
    const parts = ip.split(":");
    return `${parts.slice(0, 3).join(":")}:****`;
  }

  return ip;
}

function incrementMap(
  map: Map<string, number>,
  key: string
) {
  map.set(key, (map.get(key) || 0) + 1);
}

function percentage(value: number, total: number) {
  if (!total) return 0;

  return Number(((value / total) * 100).toFixed(1));
}

export async function GET(
  _request: NextRequest,
  context: {
    params: {
      code: string;
    };
  }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const code = context.params.code;

    if (!code) {
      return NextResponse.json(
        { error: "Short code is required" },
        { status: 400 }
      );
    }

    /*
     * Make sure this link belongs to the logged-in user.
     */
    const [linkRows] = await pool.query(
      `
      SELECT
        id,
        short_code,
        original_url,
        clicks,
        created_at
      FROM short_urls
      WHERE short_code = ?
        AND user_id = ?
      LIMIT 1
      `,
      [code, userId]
    );

    const links = linkRows as {
      id: number;
      short_code: string;
      original_url: string;
      clicks: number;
      created_at: Date;
    }[];

    if (!links.length) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    const link = links[0];

    /*
     * Overview metrics.
     */
    const [overviewRows] = await pool.query(
      `
      SELECT
        COUNT(*) AS total_clicks,
        COUNT(DISTINCT ip_address) AS unique_visitors,
        SUM(
          CASE
            WHEN clicked_at >= CURDATE()
            THEN 1
            ELSE 0
          END
        ) AS today_clicks,
        SUM(
          CASE
            WHEN clicked_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            THEN 1
            ELSE 0
          END
        ) AS last_7_days,
        SUM(
          CASE
            WHEN clicked_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            THEN 1
            ELSE 0
          END
        ) AS last_30_days
      FROM click_logs
      WHERE short_url_id = ?
      `,
      [link.id]
    );

    const overview = (overviewRows as any[])[0] || {};

    /*
     * Daily click history.
     */
    const [dailyRows] = await pool.query(
      `
      SELECT
        DATE(clicked_at) AS day,
        COUNT(*) AS clicks
      FROM click_logs
      WHERE short_url_id = ?
        AND clicked_at >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)
      GROUP BY DATE(clicked_at)
      ORDER BY day ASC
      `,
      [link.id]
    );

    const dailyMap = new Map<string, number>();

    for (const row of dailyRows as any[]) {
      const date = new Date(row.day);
      const key = date.toISOString().slice(0, 10);

      dailyMap.set(key, Number(row.clicks));
    }

    const dailyClicks = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const key = date.toISOString().slice(0, 10);

      dailyClicks.push({
        date: key,
        clicks: dailyMap.get(key) || 0,
      });
    }

    /*
     * Raw click logs.
     *
     * We use these to derive browser, OS, device,
     * referrer and visitor information.
     */
    const [logRows] = await pool.query(
      `
      SELECT
        id,
        ip_address,
        user_agent,
        referrer,
        clicked_at
      FROM click_logs
      WHERE short_url_id = ?
      ORDER BY clicked_at DESC
      `,
      [link.id]
    );

    const logs = logRows as ClickLog[];

    const browsers = new Map<string, number>();
    const operatingSystems = new Map<string, number>();
    const devices = new Map<string, number>();
    const referrers = new Map<string, number>();

    const visitorMap = new Map<
      string,
      {
        ip: string;
        clicks: number;
        firstSeen: Date;
        lastSeen: Date;
        browser: string;
        os: string;
        device: string;
      }
    >();

    for (const log of logs) {
      const browser = parseBrowser(log.user_agent);
      const os = parseOS(log.user_agent);
      const device = parseDevice(log.user_agent);
      const referrer = getReferrer(log.referrer);

      incrementMap(browsers, browser);
      incrementMap(operatingSystems, os);
      incrementMap(devices, device);
      incrementMap(referrers, referrer);

      const visitorKey = log.ip_address || "unknown";

      const existing = visitorMap.get(visitorKey);

      if (!existing) {
        visitorMap.set(visitorKey, {
          ip: visitorKey,
          clicks: 1,
          firstSeen: new Date(log.clicked_at),
          lastSeen: new Date(log.clicked_at),
          browser,
          os,
          device,
        });
      } else {
        existing.clicks += 1;

        const clickedAt = new Date(log.clicked_at);

        if (clickedAt < existing.firstSeen) {
          existing.firstSeen = clickedAt;
        }

        if (clickedAt > existing.lastSeen) {
          existing.lastSeen = clickedAt;
          existing.browser = browser;
          existing.os = os;
          existing.device = device;
        }
      }
    }

    const totalClicks = logs.length;

    const browserData = Array.from(browsers.entries())
      .map(([name, clicks]) => ({
        name,
        clicks,
        percentage: percentage(clicks, totalClicks),
      }))
      .sort((a, b) => b.clicks - a.clicks);

    const osData = Array.from(operatingSystems.entries())
      .map(([name, clicks]) => ({
        name,
        clicks,
        percentage: percentage(clicks, totalClicks),
      }))
      .sort((a, b) => b.clicks - a.clicks);

    const deviceData = Array.from(devices.entries())
      .map(([name, clicks]) => ({
        name,
        clicks,
        percentage: percentage(clicks, totalClicks),
      }))
      .sort((a, b) => b.clicks - a.clicks);

    const referrerData = Array.from(referrers.entries())
      .map(([name, clicks]) => ({
        name,
        clicks,
        percentage: percentage(clicks, totalClicks),
      }))
      .sort((a, b) => b.clicks - a.clicks);

    const visitors = Array.from(visitorMap.values())
      .sort(
        (a, b) =>
          b.lastSeen.getTime() -
          a.lastSeen.getTime()
      )
      .slice(0, 100)
      .map((visitor) => ({
        ip: maskIp(visitor.ip),
        clicks: visitor.clicks,
        firstSeen: visitor.firstSeen,
        lastSeen: visitor.lastSeen,
        browser: visitor.browser,
        os: visitor.os,
        device: visitor.device,
      }));

    const recentClicks = logs.slice(0, 100).map((log) => ({
      ip: maskIp(log.ip_address),
      browser: parseBrowser(log.user_agent),
      os: parseOS(log.user_agent),
      device: parseDevice(log.user_agent),
      referrer: getReferrer(log.referrer),
      clickedAt: log.clicked_at,
    }));

    return NextResponse.json({
      link: {
        id: link.id,
        shortCode: link.short_code,
        originalUrl: link.original_url,
        clicks: Number(link.clicks),
        createdAt: link.created_at,
      },

      overview: {
        totalClicks: Number(overview.total_clicks || 0),
        uniqueVisitors: Number(
          overview.unique_visitors || 0
        ),
        today: Number(overview.today_clicks || 0),
        last7Days: Number(
          overview.last_7_days || 0
        ),
        last30Days: Number(
          overview.last_30_days || 0
        ),
      },

      dailyClicks,

      browsers: browserData,
      operatingSystems: osData,
      devices: deviceData,
      referrers: referrerData,

      visitors,

      recentClicks,
    });
  } catch (error) {
    console.error("Analytics error:", error);

    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
