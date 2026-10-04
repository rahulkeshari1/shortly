import { NextRequest, NextResponse } from "next/server";

import pool from "@/lib/db";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      code: string;
    };
  }
) {
  try {
    const code = params.code;

    if (!code) {
      return new NextResponse("Short URL not found", {
        status: 404,
      });
    }

    const [rows] = await pool.query(
      `
      SELECT
        id,
        original_url
      FROM short_urls
      WHERE short_code = ?
      LIMIT 1
      `,
      [code]
    );

    const urls = rows as {
      id: number;
      original_url: string;
    }[];

    if (urls.length === 0) {
      return new NextResponse("Short URL not found", {
        status: 404,
      });
    }

    const shortUrl = urls[0];

    /*
     * Get visitor IP.
     *
     * x-forwarded-for is commonly supplied by reverse proxies.
     * We use the first address in the list.
     */
    const forwardedFor = req.headers.get("x-forwarded-for");

    const ipAddress =
      forwardedFor?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;

    const userAgent =
      req.headers.get("user-agent") || null;

    const referrer =
      req.headers.get("referer") || null;

    /*
     * Record click.
     */
    await pool.query(
      `
      INSERT INTO click_logs
      (
        short_url_id,
        ip_address,
        user_agent,
        referrer
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        shortUrl.id,
        ipAddress,
        userAgent,
        referrer,
      ]
    );

    /*
     * Increment total click counter.
     */
    await pool.query(
      `
      UPDATE short_urls
      SET clicks = clicks + 1
      WHERE id = ?
      `,
      [shortUrl.id]
    );

    /*
     * Redirect visitor.
     */
    return NextResponse.redirect(
      shortUrl.original_url,
      302
    );
  } catch (error) {
    console.error("Redirect error:", error);

    return new NextResponse(
      "Internal Server Error",
      {
        status: 500,
      }
    );
  }
}
