"use client";

import { useEffect, useMemo, useState } from "react";

type AnalyticsData = {
  link: {
    id: number;
    shortCode: string;
    originalUrl: string;
    clicks: number;
    createdAt: string;
  };

  overview: {
    totalClicks: number;
    uniqueVisitors: number;
    today: number;
    last7Days: number;
    last30Days: number;
  };

  dailyClicks: {
    date: string;
    clicks: number;
  }[];

  browsers: AnalyticsItem[];
  operatingSystems: AnalyticsItem[];
  devices: AnalyticsItem[];
  referrers: AnalyticsItem[];

  visitors: Visitor[];
  recentClicks: RecentClick[];
};

type AnalyticsItem = {
  name: string;
  clicks: number;
  percentage: number;
};

type Visitor = {
  ip: string;
  clicks: number;
  firstSeen: string;
  lastSeen: string;
  browser: string;
  os: string;
  device: string;
};

type RecentClick = {
  ip: string;
  browser: string;
  os: string;
  device: string;
  referrer: string;
  clickedAt: string;
};

export default function AnalyticsPage({
  code,
}: {
  code: string;
}) {
  const [data, setData] =
    useState<AnalyticsData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/analytics/${encodeURIComponent(code)}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Failed to load analytics"
          );
        }

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [code]);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-red-400/10 bg-red-400/[0.04] text-red-400">
          !
        </div>

        <h1 className="mt-4 text-[14px] font-semibold text-white">
          Unable to load analytics
        </h1>

        <p className="mt-1 text-[11px] text-zinc-600">
          {error || "Something went wrong."}
        </p>

        <a
          href="/dashboard"
          className="mt-5 inline-flex h-8 items-center rounded-md bg-white px-3.5 text-[10px] font-semibold text-black"
        >
          Back to dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[10px] text-zinc-600 transition hover:text-zinc-300"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-3 w-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 18l-6-6 6-6"
              />
            </svg>
            Back to dashboard
          </a>

          <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
            Link analytics
          </div>

          <h1 className="mt-2 truncate text-[22px] font-semibold tracking-[-0.025em] text-white">
            /{data.link.shortCode}
          </h1>

          <p className="mt-1 max-w-2xl truncate text-[11px] text-zinc-600">
            {data.link.originalUrl}
          </p>
        </div>

        <a
          href={`/${data.link.shortCode}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.025] px-3.5 text-[10px] font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
        >
          Open short link
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="ml-1.5 h-3 w-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 17 17 7M8 7h9v9"
            />
          </svg>
        </a>
      </div>

      {/* Overview */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Metric
          label="Total clicks"
          value={data.overview.totalClicks}
        />

        <Metric
          label="Unique visitors"
          value={data.overview.uniqueVisitors}
        />

        <Metric
          label="Today"
          value={data.overview.today}
        />

        <Metric
          label="Last 7 days"
          value={data.overview.last7Days}
        />

        <Metric
          label="Last 30 days"
          value={data.overview.last30Days}
        />
      </div>

      {/* Chart */}
      <section className="mt-5 rounded-xl border border-white/[0.07] bg-[#0d0f12]">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <h2 className="text-[12px] font-semibold text-zinc-200">
            Click activity
          </h2>

          <p className="mt-0.5 text-[10px] text-zinc-600">
            Daily clicks over the last 30 days
          </p>
        </div>

        <ClickChart data={data.dailyClicks} />
      </section>

      {/* Breakdown */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Breakdown
          title="Browsers"
          subtitle="Browsers used by visitors"
          items={data.browsers}
        />

        <Breakdown
          title="Operating systems"
          subtitle="Visitor operating systems"
          items={data.operatingSystems}
        />

        <Breakdown
          title="Devices"
          subtitle="Desktop, mobile and tablet traffic"
          items={data.devices}
        />

        <Breakdown
          title="Traffic sources"
          subtitle="Where visitors came from"
          items={data.referrers}
        />
      </div>

      {/* Visitors */}
      <section className="mt-5 overflow-hidden rounded-xl border border-white/[0.07] bg-[#0d0f12]">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <h2 className="text-[12px] font-semibold text-zinc-200">
            Visitors
          </h2>

          <p className="mt-0.5 text-[10px] text-zinc-600">
            Unique visitors identified by IP address
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-white/[0.05] text-left">
                <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-[0.1em] text-zinc-700">
                  Visitor
                </th>
                <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-[0.1em] text-zinc-700">
                  Device
                </th>
                <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-[0.1em] text-zinc-700">
                  Browser
                </th>
                <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-[0.1em] text-zinc-700">
                  Clicks
                </th>
                <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-[0.1em] text-zinc-700">
                  Last seen
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {data.visitors.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-[10px] text-zinc-700"
                  >
                    No visitors yet.
                  </td>
                </tr>
              ) : (
                data.visitors.map((visitor, index) => (
                  <tr
                    key={`${visitor.ip}-${index}`}
                    className="transition hover:bg-white/[0.015]"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-mono text-[10px] text-zinc-400">
                        {visitor.ip}
                      </p>

                      <p className="mt-1 text-[9px] text-zinc-700">
                        First seen{" "}
                        {formatDateTime(visitor.firstSeen)}
                      </p>
                    </td>

                    <td className="px-5 py-3.5 text-[10px] text-zinc-500">
                      {visitor.device}
                    </td>

                    <td className="px-5 py-3.5 text-[10px] text-zinc-500">
                      {visitor.browser}
                    </td>

                    <td className="px-5 py-3.5 text-[11px] font-medium text-zinc-300">
                      {visitor.clicks}
                    </td>

                    <td className="px-5 py-3.5 text-[10px] text-zinc-600">
                      {formatDateTime(visitor.lastSeen)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent clicks */}
      <section className="mt-5 overflow-hidden rounded-xl border border-white/[0.07] bg-[#0d0f12]">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <h2 className="text-[12px] font-semibold text-zinc-200">
            Recent clicks
          </h2>

          <p className="mt-0.5 text-[10px] text-zinc-600">
            Latest activity for this link
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-white/[0.05] text-left">
                <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-[0.1em] text-zinc-700">
                  Time
                </th>
                <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-[0.1em] text-zinc-700">
                  Visitor
                </th>
                <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-[0.1em] text-zinc-700">
                  Device
                </th>
                <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-[0.1em] text-zinc-700">
                  Browser
                </th>
                <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-[0.1em] text-zinc-700">
                  Source
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {data.recentClicks.map((click, index) => (
                <tr
                  key={`${click.clickedAt}-${index}`}
                  className="transition hover:bg-white/[0.015]"
                >
                  <td className="whitespace-nowrap px-5 py-3.5 text-[10px] text-zinc-500">
                    {formatDateTime(click.clickedAt)}
                  </td>

                  <td className="px-5 py-3.5 font-mono text-[10px] text-zinc-500">
                    {click.ip}
                  </td>

                  <td className="px-5 py-3.5 text-[10px] text-zinc-500">
                    {click.device}
                  </td>

                  <td className="px-5 py-3.5 text-[10px] text-zinc-500">
                    {click.browser}
                  </td>

                  <td className="max-w-[180px] truncate px-5 py-3.5 text-[10px] text-zinc-600">
                    {click.referrer}
                  </td>
                </tr>
              ))}

              {data.recentClicks.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-[10px] text-zinc-700"
                  >
                    No clicks yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Privacy note */}
      <p className="mx-auto mt-5 max-w-2xl text-center text-[9px] leading-5 text-zinc-700">
        Visitor information is derived from request metadata such as IP
        address, browser, device and referrer. IP addresses are masked in
        the dashboard.
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0d0f12] p-4">
      <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-zinc-600">
        {label}
      </p>

      <p className="mt-2.5 text-[19px] font-semibold tracking-[-0.02em] text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function Breakdown({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: AnalyticsItem[];
}) {
  const max = Math.max(
    ...items.map((item) => item.clicks),
    1
  );

  return (
    <section className="rounded-xl border border-white/[0.07] bg-[#0d0f12]">
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-[12px] font-semibold text-zinc-200">
          {title}
        </h2>

        <p className="mt-0.5 text-[10px] text-zinc-600">
          {subtitle}
        </p>
      </div>

      <div className="space-y-4 p-5">
        {items.length === 0 ? (
          <p className="py-4 text-center text-[10px] text-zinc-700">
            No data yet.
          </p>
        ) : (
          items.slice(0, 8).map((item) => (
            <div key={item.name}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400">
                  {item.name}
                </span>

                <span className="text-[10px] text-zinc-600">
                  {item.clicks.toLocaleString()} ·{" "}
                  {item.percentage}%
                </span>
              </div>

              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.04]">
                <div
                  className="h-full rounded-full bg-zinc-400"
                  style={{
                    width: `${Math.max(
                      (item.clicks / max) * 100,
                      2
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function ClickChart({
  data,
}: {
  data: {
    date: string;
    clicks: number;
  }[];
}) {
  const max = Math.max(
    ...data.map((item) => item.clicks),
    1
  );

  return (
    <div className="p-5">
      <div className="flex h-48 items-end gap-1 sm:gap-1.5">
        {data.map((item) => {
          const height =
            item.clicks === 0
              ? 2
              : Math.max(
                  (item.clicks / max) * 100,
                  5
                );

          return (
            <div
              key={item.date}
              className="group relative flex h-full flex-1 items-end"
              title={`${formatChartDate(item.date)}: ${item.clicks} clicks`}
            >
              <div
                className="w-full rounded-t-sm bg-zinc-600 transition group-hover:bg-zinc-300"
                style={{
                  height: `${height}%`,
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-between text-[9px] text-zinc-700">
        <span>
          {data.length
            ? formatChartDate(data[0].date)
            : ""}
        </span>

        <span>Last 30 days</span>

        <span>
          {data.length
            ? formatChartDate(
                data[data.length - 1].date
              )
            : ""}
        </span>
      </div>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatChartDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-9 sm:px-6 lg:px-8">
      <div className="h-3 w-24 rounded bg-white/[0.05]" />
      <div className="mt-4 h-7 w-48 rounded bg-white/[0.05]" />
      <div className="mt-2 h-3 w-80 max-w-full rounded bg-white/[0.04]" />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-24 rounded-xl border border-white/[0.05] bg-[#0d0f12]"
          />
        ))}
      </div>

      <div className="mt-5 h-72 rounded-xl border border-white/[0.05] bg-[#0d0f12]" />

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="h-64 rounded-xl bg-[#0d0f12]" />
        <div className="h-64 rounded-xl bg-[#0d0f12]" />
      </div>
    </div>
  );
}
