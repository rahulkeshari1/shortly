
"use client";

import {
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type LinkData = {
  id: number;
  short_code: string;
  original_url: string;
  clicks: number;
  created_at: string;
  last_clicked_at: string | null;
};

type Props = {
  links: LinkData[];
  baseUrl: string;
  totalClicks: number;
  uniqueVisitors: number;
};

export default function DashboardClient({
  links,
  baseUrl,
  totalClicks,
  uniqueVisitors,
}: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filteredLinks = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return links;
    }

    return links.filter((link) => {
      return (
        link.short_code.toLowerCase().includes(value) ||
        link.original_url.toLowerCase().includes(value)
      );
    });
  }, [links, search]);

  async function copyLink(shortCode: string) {
    const url = `${baseUrl}/${shortCode}`;

    try {
      await navigator.clipboard.writeText(url);

      setCopied(shortCode);

      window.setTimeout(() => {
        setCopied(null);
      }, 1800);
    } catch {
      const textarea = document.createElement("textarea");

      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();

      setCopied(shortCode);

      window.setTimeout(() => {
        setCopied(null);
      }, 1800);
    }
  }

  async function refreshDashboard() {
    if (refreshing) return;

    setRefreshing(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 450)
    );

    router.refresh();

    window.setTimeout(() => {
      setRefreshing(false);
    }, 650);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* =========================================================
          HERO
      ========================================================== */}
      <div className="dashboard-enter flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-500 opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-zinc-500" />
            </span>

            Dashboard
          </div>

          <h1 className="mt-2 text-[25px] font-semibold tracking-[-0.035em] text-white sm:text-[28px]">
            Your links
          </h1>

          <p className="mt-1.5 max-w-xl text-[12px] leading-5 text-zinc-500">
            Create, share and understand every short link from one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshDashboard}
            disabled={refreshing}
            className="group flex h-8 items-center gap-2 rounded-md border border-white/[0.07] bg-white/[0.025] px-3 text-[10px] font-medium text-zinc-500 transition hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className={`h-3.5 w-3.5 ${
                refreshing ? "animate-spin" : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4"
              />
            </svg>

            {refreshing ? "Refreshing" : "Refresh"}
          </button>

          <a
            href="/"
            className="group flex h-8 items-center gap-1.5 rounded-md bg-white px-3.5 text-[10px] font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.98]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-90"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v14M5 12h14"
              />
            </svg>

            Create short link
          </a>
        </div>
      </div>

      {/* =========================================================
          STATS
      ========================================================== */}
      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <StatCard
          index={0}
          label="Total links"
          value={links.length.toLocaleString()}
          description="Links you've created"
          icon={<LinkIcon />}
        />

        <StatCard
          index={1}
          label="Total clicks"
          value={totalClicks.toLocaleString()}
          description="All-time link activity"
          icon={<ChartIcon />}
        />

        <StatCard
          index={2}
          label="Unique visitors"
          value={uniqueVisitors.toLocaleString()}
          description="Distinct IP visitors"
          icon={<UsersIcon />}
        />
      </div>

      {/* =========================================================
          LINKS SECTION
      ========================================================== */}
      <section className="dashboard-enter-delay mt-6 overflow-hidden rounded-xl border border-white/[0.07] bg-[#0d0f12]">
        {/* Section header */}
        <div className="flex flex-col gap-3 border-b border-white/[0.06] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="text-[12px] font-semibold text-zinc-200">
              Your shortened links
            </h2>

            <p className="mt-0.5 text-[10px] text-zinc-600">
              Copy, share or open analytics for any link.
            </p>
          </div>

          {links.length > 0 && (
            <div className="relative w-full sm:w-56">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-700"
              >
                <circle cx="11" cy="11" r="7" />
                <path
                  strokeLinecap="round"
                  d="m20 20-4-4"
                />
              </svg>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search links..."
                className="h-8 w-full rounded-md border border-white/[0.07] bg-white/[0.02] pl-8 pr-3 text-[10px] text-zinc-300 outline-none transition placeholder:text-zinc-700 focus:border-white/[0.14] focus:bg-white/[0.035]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-zinc-700 hover:text-zinc-300"
                >
                  ×
                </button>
              )}
            </div>
          )}
        </div>

        {/* Empty */}
        {links.length === 0 ? (
          <EmptyState />
        ) : filteredLinks.length === 0 ? (
          <SearchEmptyState search={search} />
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {filteredLinks.map((link, index) => (
              <LinkCard
                key={link.id}
                link={link}
                baseUrl={baseUrl}
                index={index}
                copied={copied === link.short_code}
                onCopy={() =>
                  copyLink(link.short_code)
                }
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {links.length > 0 && (
          <div className="border-t border-white/[0.05] px-4 py-3 sm:px-5">
            <p className="text-[9px] text-zinc-700">
              {filteredLinks.length === links.length
                ? `${links.length} ${
                    links.length === 1 ? "link" : "links"
                  }`
                : `${filteredLinks.length} of ${links.length} links`}
            </p>
          </div>
        )}
      </section>

      {/* Bottom helper */}
      <div className="dashboard-enter-delay-2 mt-5 flex items-center justify-center gap-2 text-center">
        <div className="h-px w-8 bg-white/[0.05]" />

        <p className="text-[9px] text-zinc-700">
          Every click is automatically tracked
        </p>

        <div className="h-px w-8 bg-white/[0.05]" />
      </div>
    </div>
  );
}

/* ===============================================================
   LINK CARD
================================================================ */

function LinkCard({
  link,
  baseUrl,
  index,
  copied,
  onCopy,
}: {
  link: LinkData;
  baseUrl: string;
  index: number;
  copied: boolean;
  onCopy: () => void;
}) {
  const shortUrl = `${baseUrl}/${link.short_code}`;

  return (
    <article
      className="link-card group px-4 py-5 sm:px-5"
      style={{
        animationDelay: `${Math.min(index * 55, 500)}ms`,
      }}
    >
      <div className="flex flex-col gap-4">
        {/* Top */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            {/* Short URL */}
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.025] text-zinc-500 transition duration-200 group-hover:border-white/[0.12] group-hover:text-zinc-300">
                <LinkIcon />
              </div>

              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={shortUrl}
                className="min-w-0 truncate text-[13px] font-semibold tracking-[-0.01em] text-zinc-200 transition hover:text-white"
              >
                {baseUrl.replace(/^https?:\/\//, "")}/
                {link.short_code}
              </a>
            </div>

            {/* Original URL */}
            <p
              title={link.original_url}
              className="mt-2 max-w-3xl truncate pl-9 text-[10px] text-zinc-600"
            >
              {link.original_url}
            </p>
          </div>

          {/* Click metric */}
          <div className="flex items-center gap-3 lg:shrink-0">
            <div className="text-right">
              <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-zinc-700">
                Clicks
              </p>

              <p className="mt-0.5 text-[17px] font-semibold tracking-[-0.02em] text-zinc-200">
                {link.clicks.toLocaleString()}
              </p>
            </div>

            <div className="h-8 w-px bg-white/[0.05]" />

            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-zinc-700">
                Status
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-30" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>

                <span className="text-[10px] text-zinc-500">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex flex-col gap-3 border-t border-white/[0.045] pt-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pl-0 sm:pl-9">
            <InfoItem
              label="Created"
              value={formatDate(link.created_at)}
            />

            <InfoItem
              label="Last click"
              value={
                link.last_clicked_at
                  ? formatRelativeTime(
                      link.last_clicked_at
                    )
                  : "No clicks yet"
              }
            />
          </div>

          <div className="flex items-center gap-1.5">
            {/* Copy */}
            <button
              type="button"
              onClick={onCopy}
              className={`copy-button group/copy relative flex h-8 items-center gap-1.5 rounded-md border px-3 text-[10px] font-medium transition-all duration-200 active:scale-[0.96] ${
                copied
                  ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-400"
                  : "border-white/[0.07] bg-white/[0.025] text-zinc-400 hover:border-white/[0.13] hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              {copied ? (
                <>
                  <span className="copy-success">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-3.5 w-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m5 12 4 4L19 6"
                      />
                    </svg>
                  </span>

                  Copied
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-3.5 w-3.5"
                  >
                    <rect
                      width="13"
                      height="13"
                      x="8"
                      y="8"
                      rx="2"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
                    />
                  </svg>

                  Copy link
                </>
              )}
            </button>

            {/* Analytics */}
            <a
              href={`/dashboard/links/${link.short_code}`}
              className="analytics-button flex h-8 items-center gap-1.5 rounded-md bg-white px-3 text-[10px] font-semibold text-black transition-all duration-200 hover:bg-zinc-200 active:scale-[0.97]"
            >
              View analytics

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M13 6l6 6-6 6"
                />
              </svg>
            </a>

            {/* Open */}
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${link.short_code}`}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.025] text-zinc-600 transition hover:border-white/[0.13] hover:bg-white/[0.05] hover:text-zinc-300"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-3.5 w-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 17 17 7M8 7h9v9"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ===============================================================
   STAT CARD
================================================================ */

function StatCard({
  label,
  value,
  description,
  icon,
  index,
}: {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
  index: number;
}) {
  return (
    <div
      className="stat-card group rounded-xl border border-white/[0.07] bg-[#0d0f12] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-[#101216]"
      style={{
        animationDelay: `${index * 70}ms`,
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-zinc-600">
          {label}
        </p>

        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.025] text-zinc-600 transition duration-300 group-hover:border-white/[0.1] group-hover:text-zinc-300">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-[21px] font-semibold tracking-[-0.03em] text-white">
        {value}
      </p>

      <p className="mt-0.5 text-[9px] text-zinc-700">
        {description}
      </p>
    </div>
  );
}

/* ===============================================================
   INFO
================================================================ */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[9px]">
      <span className="text-zinc-700">{label}</span>

      <span className="text-zinc-500">{value}</span>
    </div>
  );
}

/* ===============================================================
   EMPTY
================================================================ */

function EmptyState() {
  return (
    <div className="px-5 py-20 text-center">
      <div className="empty-icon mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-zinc-600">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 7 20l1.15-1.15"
          />
        </svg>
      </div>

      <h3 className="mt-5 text-[13px] font-semibold text-zinc-300">
        No short links yet
      </h3>

      <p className="mx-auto mt-1.5 max-w-sm text-[10px] leading-5 text-zinc-600">
        Create your first short URL and you'll be able to
        copy, share and track every click from here.
      </p>

      <a
        href="/"
        className="mt-6 inline-flex h-8 items-center gap-1.5 rounded-md bg-white px-3.5 text-[10px] font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.97]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-3.5 w-3.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 5v14M5 12h14"
          />
        </svg>

        Create your first link
      </a>
    </div>
  );
}

/* ===============================================================
   SEARCH EMPTY
================================================================ */

function SearchEmptyState({
  search,
}: {
  search: string;
}) {
  return (
    <div className="px-5 py-16 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-zinc-700">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="h-4 w-4"
        >
          <circle cx="11" cy="11" r="7" />
          <path
            strokeLinecap="round"
            d="m20 20-4-4"
          />
        </svg>
      </div>

      <p className="mt-4 text-[11px] font-medium text-zinc-400">
        No links found
      </p>

      <p className="mt-1 text-[10px] text-zinc-700">
        Nothing matches "{search}"
      </p>
    </div>
  );
}

/* ===============================================================
   ICONS
================================================================ */

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-3.5 w-3.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 7 20l1.15-1.15"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-3.5 w-3.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16l5-5 4 4 7-8"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 7h5v5"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-3.5 w-3.5"
    >
      <circle cx="9" cy="8" r="3" />

      <path
        strokeLinecap="round"
        d="M3.5 20a5.5 5.5 0 0 1 11 0"
      />

      <path
        strokeLinecap="round"
        d="M16 5.5a3 3 0 0 1 0 5.8"
      />

      <path
        strokeLinecap="round"
        d="M17 14a5 5 0 0 1 4 5"
      />
    </svg>
  );
}

/* ===============================================================
   DATE HELPERS
================================================================ */

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function formatRelativeTime(value: string) {
  const date = new Date(value);
  const now = new Date();

  const seconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );

  if (seconds < 30) {
    return "Just now";
  }

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
}
