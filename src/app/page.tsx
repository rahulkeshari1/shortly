"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";

export default function Home() {
  const { data: session } = useSession();

  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setShortUrl("");
    setCopied(false);

    if (!url.trim()) {
      setError("Paste a URL to continue.");
      return;
    }

    try {
      const parsed = new URL(url.trim());

      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error();
      }
    } catch {
      setError("Please enter a valid HTTP or HTTPS URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to shorten URL.");
      }

      setShortUrl(data.data.shortUrl);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyUrl() {
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setError("Unable to copy the link.");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#08090b] text-zinc-100">
      <Header />

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-[-260px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-white/[0.035] blur-[130px]" />

        <div className="pointer-events-none absolute left-1/2 top-[360px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/[0.012] blur-[100px]" />

        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative mx-auto max-w-[1180px] px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
          {/* Badge */}

          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] font-medium text-zinc-400 backdrop-blur-xl sm:text-[11px]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-400 opacity-40" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-zinc-300" />
              </span>

              Simple, fast URL shortening
            </div>
          </div>

          {/* Heading */}

          <div className="mx-auto mt-7 max-w-4xl text-center sm:mt-8">
            <h1 className="text-[38px] font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:text-[54px] md:text-[64px] lg:text-[72px]">
              Short links.
              <br />
              <span className="text-zinc-500">
                Clear analytics.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-[590px] text-[13px] leading-6 text-zinc-500 sm:mt-6 sm:text-[14px] md:text-[15px]">
              Turn long URLs into clean, shareable links.
              Create them instantly and understand how
              people interact with every link.
            </p>
          </div>

          {/* =====================================================
              SHORTENER
          ===================================================== */}

          <div className="mx-auto mt-9 w-full max-w-[760px] sm:mt-11">
            <form onSubmit={handleSubmit}>
              <div className="rounded-2xl border border-white/[0.09] bg-[#0d0f12]/95 p-1.5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-2">
                <div className="flex flex-col gap-1.5 sm:flex-row">
                  {/* Input */}

                  <div className="relative min-w-0 flex-1">
                    <div className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center text-zinc-600">
                      <LinkIcon />
                    </div>

                    <input
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        setError("");
                      }}
                      type="url"
                      placeholder="Paste your long URL..."
                      aria-label="Long URL"
                      className="h-12 w-full rounded-xl border border-transparent bg-[#111318] pl-10 pr-4 text-[13px] text-white outline-none transition placeholder:text-zinc-600 hover:bg-[#13161b] focus:border-white/[0.12] focus:bg-[#13161b] sm:h-[52px]"
                    />
                  </div>

                  {/* Button */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[12px] font-semibold text-black transition duration-200 hover:bg-zinc-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:h-[52px] sm:w-auto sm:min-w-[142px]"
                  >
                    {loading ? (
                      <>
                        <Spinner />
                        Creating
                      </>
                    ) : (
                      <>
                        Shorten URL
                        <ArrowRight />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Error */}

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-500/10 bg-red-500/[0.045] px-3.5 py-3 text-[11px] leading-5 text-red-400">
                <AlertIcon />
                <span>{error}</span>
              </div>
            )}

            {/* Result */}

            {shortUrl && (
              <div className="mt-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0f12] text-left shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                <div className="border-b border-white/[0.05] px-4 py-3 sm:px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                        Your short link
                      </p>

                      <p className="mt-1 text-[10px] text-zinc-500">
                        Ready to share
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] text-zinc-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
                      Active
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex h-11 min-w-0 flex-1 items-center rounded-xl border border-white/[0.06] bg-[#090a0c] px-3.5">
                      <span className="truncate text-[12px] font-medium text-zinc-200">
                        {shortUrl}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex">
                      <button
                        onClick={copyUrl}
                        type="button"
                        className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] px-4 text-[11px] font-medium text-zinc-300 transition hover:bg-white/[0.04] hover:text-white active:scale-[0.98]"
                      >
                        {copied ? <CheckIcon /> : <CopyIcon />}
                        {copied ? "Copied" : "Copy"}
                      </button>

                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-white px-4 text-[11px] font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.98]"
                      >
                        Open
                        <ExternalIcon />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Helper */}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[10px] text-zinc-600">
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon />
                No account required
              </span>

              <span className="hidden h-3 w-px bg-white/[0.07] sm:block" />

              <span className="inline-flex items-center gap-1.5">
                <CheckIcon />
                Free to use
              </span>

              <span className="hidden h-3 w-px bg-white/[0.07] sm:block" />

              <span className="inline-flex items-center gap-1.5">
                <CheckIcon />
                {session?.user
                  ? "Saved to your dashboard"
                  : "Sign in to save links"}
              </span>
            </div>
          </div>

          {/* Trust strip */}

          <div className="mx-auto mt-14 grid max-w-[760px] grid-cols-2 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.015] sm:grid-cols-4">
            <TrustItem
              icon={<ZapIcon />}
              title="Fast"
              text="Instant links"
            />

            <TrustItem
              icon={<ChartIcon />}
              title="Analytics"
              text="Track clicks"
            />

            <TrustItem
              icon={<LinkIcon />}
              title="Shareable"
              text="Clean URLs"
            />

            <TrustItem
              icon={<ShieldIcon />}
              title="Reliable"
              text="Built for links"
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================= */}

      <section
        id="features"
        className="border-t border-white/[0.06]"
      >
        <div className="mx-auto max-w-[1180px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <SectionHeading
            eyebrow="Features"
            title={
              <>
                Everything you need to manage
                <br className="hidden sm:block" /> your short links.
              </>
            }
            description="Shortly keeps URL shortening simple while giving you the tools to understand and manage the links you create."
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              number="01"
              icon={<LinkIcon />}
              title="Instant short links"
              description="Turn long URLs into clean, compact links in seconds. No complicated setup or unnecessary steps."
            />

            <FeatureCard
              number="02"
              icon={<ChartIcon />}
              title="Click analytics"
              description="See how your links perform with click counts and detailed analytics from your dashboard."
            />

            <FeatureCard
              number="03"
              icon={<UsersIcon />}
              title="Visitor insights"
              description="Understand visitor activity with useful device, browser, operating system and traffic information."
            />

            <FeatureCard
              number="04"
              icon={<LayoutIcon />}
              title="Link dashboard"
              description="Keep your links organized in one focused workspace with quick access to analytics."
            />

            <FeatureCard
              number="05"
              icon={<CopyIcon />}
              title="Easy sharing"
              description="Copy your short link instantly and use it across websites, messages, social platforms and campaigns."
            />

            <FeatureCard
              number="06"
              icon={<ActivityIcon />}
              title="Click history"
              description="Understand when your links receive traffic with recent activity and historical click information."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          ANALYTICS PREVIEW
      ========================================================= */}

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1180px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                Link analytics
              </p>

              <h2 className="mt-3 text-[27px] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-[34px]">
                Know what happens
                <br />
                after the click.
              </h2>

              <p className="mt-5 max-w-[430px] text-[12px] leading-6 text-zinc-600 sm:text-[13px]">
                Creating a short link is only the beginning. Shortly gives
                you a focused view of how your links are being used so you
                can understand traffic without digging through complicated
                reports.
              </p>

              <div className="mt-7 space-y-3">
                <Bullet text="Track total and recent clicks" />
                <Bullet text="Understand unique visitors" />
                <Bullet text="See browsers and devices" />
                <Bullet text="Review traffic sources" />
              </div>
            </div>

            <AnalyticsPreview />
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}

      <section
        id="how-it-works"
        className="border-t border-white/[0.06]"
      >
        <div className="mx-auto max-w-[1100px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title={
              <>
                From long URL to useful
                <br className="hidden sm:block" /> analytics.
              </>
            }
            description="The process is intentionally simple. Shortly handles the redirect and records useful click information behind the scenes."
            centered
          />

          <div className="relative mt-14">
            {/* Desktop connector */}

            <div className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-5 hidden h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent sm:block" />

            <div className="grid gap-10 sm:grid-cols-3">
              <HowStep
                number="01"
                title="Paste your URL"
                text="Enter the long HTTP or HTTPS URL you want to make shorter."
                icon={<LinkIcon />}
              />

              <HowStep
                number="02"
                title="Shortly creates it"
                text="Your URL is assigned a unique short code that points back to the original destination."
                icon={<SparkIcon />}
              />

              <HowStep
                number="03"
                title="Share & track"
                text="Share the short URL. When visitors click it, the redirect happens and activity can be viewed in analytics."
                icon={<ChartIcon />}
              />
            </div>
          </div>

          {/* Detailed flow */}

          <div className="mt-16 rounded-2xl border border-white/[0.07] bg-[#0d0f12] p-5 sm:p-7">
            <div className="mb-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                Behind the link
              </p>

              <h3 className="mt-2 text-[17px] font-semibold tracking-[-0.025em] text-white">
                What happens when someone clicks?
              </h3>
            </div>

            <div className="grid gap-2 sm:grid-cols-5">
              <FlowItem number="01" title="Visitor clicks" />
              <FlowArrow />
              <FlowItem number="02" title="Shortly receives request" />
              <FlowArrow />
              <FlowItem number="03" title="Redirects to destination" />
            </div>

            <div className="mt-2 grid gap-2 sm:grid-cols-5">
              <FlowItem number="04" title="Click is recorded" />
              <FlowArrow />
              <FlowItem number="05" title="Analytics updated" />
              <div className="hidden sm:block" />
              <div className="hidden sm:block" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          USE CASES
      ========================================================= */}

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1180px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <SectionHeading
            eyebrow="Use cases"
            title="One short link. Many places to use it."
            description="Keep shared URLs cleaner across the places where people discover, open and share links."
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <UseCase
              icon={<MessageIcon />}
              title="Messaging"
              text="Share cleaner links in WhatsApp, chats and direct messages."
            />

            <UseCase
              icon={<GlobeIcon />}
              title="Websites"
              text="Use compact URLs in pages, buttons, documents and QR codes."
            />

            <UseCase
              icon={<MegaphoneIcon />}
              title="Marketing"
              text="Create shareable campaign links and understand their performance."
            />

            <UseCase
              icon={<ShareIcon />}
              title="Social"
              text="Keep social posts and profiles cleaner with shorter URLs."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[900px] px-4 py-20 text-center sm:px-6 sm:py-24">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-zinc-400">
            <SparkIcon />
          </div>

          <h2 className="mt-5 text-[28px] font-semibold tracking-[-0.04em] text-white sm:text-[36px]">
            Ready to shorten your next link?
          </h2>

          <p className="mx-auto mt-3 max-w-[470px] text-[12px] leading-6 text-zinc-600 sm:text-[13px]">
            Create a clean short link in seconds. Sign in when you want
            to save and understand your links.
          </p>

          <a
            href="#top"
            className="mt-7 inline-flex h-10 items-center gap-2 rounded-lg bg-white px-5 text-[11px] font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.98]"
          >
            Shorten a URL
            <ArrowUpIcon />
          </a>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[9px] font-black text-black">
              S
            </div>

            <span className="text-[11px] font-medium text-zinc-400">
              Shortly
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-zinc-700">
            <a
              href="/"
              className="transition hover:text-zinc-400"
            >
              Home
            </a>

            <a
              href="#features"
              className="transition hover:text-zinc-400"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-zinc-400"
            >
              How it works
            </a>

            <span>© {new Date().getFullYear()} Shortly</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ================================================================
   SECTION HEADING
================================================================ */

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  centered?: boolean;
}) {
  return (
    <div
      className={
        centered
          ? "mx-auto max-w-[650px] text-center"
          : "max-w-[680px]"
      }
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-[25px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[32px]">
        {title}
      </h2>

      <p className="mt-4 max-w-[560px] text-[12px] leading-6 text-zinc-600 sm:text-[13px]">
        {description}
      </p>
    </div>
  );
}

/* ================================================================
   TRUST ITEM
================================================================ */

function TrustItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-white/[0.05] px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-zinc-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-zinc-300">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[9px] text-zinc-600">
          {text}
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   FEATURE CARD
================================================================ */

function FeatureCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-[#0d0f12] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.11] hover:bg-[#101216]">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-zinc-500 transition group-hover:text-zinc-300">
          {icon}
        </div>

        <span className="text-[9px] font-semibold tracking-[0.12em] text-zinc-700">
          {number}
        </span>
      </div>

      <h3 className="mt-8 text-[13px] font-semibold text-zinc-200">
        {title}
      </h3>

      <p className="mt-2 text-[11px] leading-5 text-zinc-600">
        {description}
      </p>
    </div>
  );
}

/* ================================================================
   ANALYTICS PREVIEW
================================================================ */

function AnalyticsPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-10 rounded-full bg-white/[0.015] blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0e11] shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
        {/* Window top */}

        <div className="flex h-11 items-center justify-between border-b border-white/[0.06] px-4">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
          </div>

          <span className="text-[9px] text-zinc-700">
            Link analytics
          </span>

          <div className="h-5 w-14 rounded-md bg-white/[0.03]" />
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-700">
                Overview
              </p>

              <p className="mt-1 text-[13px] font-semibold text-zinc-200">
                Link performance
              </p>
            </div>

            <div className="rounded-md border border-white/[0.06] px-2 py-1 text-[8px] text-zinc-600">
              Last 30 days
            </div>
          </div>

          {/* Metrics */}

          <div className="mt-4 grid grid-cols-3 gap-2">
            <MiniMetric
              label="Clicks"
              value="12.4K"
              change="+18.2%"
            />

            <MiniMetric
              label="Visitors"
              value="8.9K"
              change="+12.4%"
            />

            <MiniMetric
              label="Devices"
              value="4"
              change="Tracked"
            />
          </div>

          {/* Chart */}

          <div className="mt-3 rounded-xl border border-white/[0.05] bg-[#090a0c] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-zinc-600">
                Click activity
              </span>

              <span className="text-[9px] text-zinc-700">
                30 days
              </span>
            </div>

            <div className="relative mt-4 h-[115px] overflow-hidden">
              <div className="absolute inset-x-0 top-0 border-t border-white/[0.035]" />
              <div className="absolute inset-x-0 top-1/3 border-t border-white/[0.035]" />
              <div className="absolute inset-x-0 top-2/3 border-t border-white/[0.035]" />
              <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.035]" />

              <svg
                viewBox="0 0 600 150"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
              >
                <path
                  d="M0 125 C30 120 45 105 70 110 C95 115 105 95 130 100 C155 105 165 75 190 82 C215 89 230 65 255 72 C280 79 295 45 320 60 C345 75 360 40 385 48 C410 56 430 30 450 42 C470 54 490 24 515 35 C540 46 555 18 575 25 C590 30 595 18 600 15"
                  fill="none"
                  stroke="rgba(255,255,255,0.65)"
                  strokeWidth="2"
                />

                <path
                  d="M0 125 C30 120 45 105 70 110 C95 115 105 95 130 100 C155 105 165 75 190 82 C215 89 230 65 255 72 C280 79 295 45 320 60 C345 75 360 40 385 48 C410 56 430 30 450 42 C470 54 490 24 515 35 C540 46 555 18 575 25 C590 30 595 18 600 15 L600 150 L0 150 Z"
                  fill="rgba(255,255,255,0.025)"
                />
              </svg>
            </div>
          </div>

          {/* Bottom stats */}

          <div className="mt-3 grid grid-cols-2 gap-2">
            <PreviewList
              title="Browsers"
              items={[
                ["Chrome", "64%"],
                ["Safari", "22%"],
                ["Firefox", "9%"],
              ]}
            />

            <PreviewList
              title="Devices"
              items={[
                ["Mobile", "71%"],
                ["Desktop", "25%"],
                ["Tablet", "4%"],
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.018] p-3">
      <p className="text-[8px] text-zinc-700">{label}</p>

      <p className="mt-1 text-[15px] font-semibold tracking-[-0.02em] text-zinc-200">
        {value}
      </p>

      <p className="mt-1 text-[8px] text-zinc-600">
        {change}
      </p>
    </div>
  );
}

function PreviewList({
  title,
  items,
}: {
  title: string;
  items: [string, string][];
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.018] p-3">
      <p className="text-[8px] text-zinc-700">
        {title}
      </p>

      <div className="mt-2 space-y-2">
        {items.map(([name, value]) => (
          <div
            key={name}
            className="flex items-center justify-between"
          >
            <span className="text-[9px] text-zinc-500">
              {name}
            </span>

            <span className="text-[9px] font-medium text-zinc-300">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   HOW STEP
================================================================ */

function HowStep({
  number,
  title,
  text,
  icon,
}: {
  number: string;
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative text-center">
      <div className="relative z-10 mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0b0d10] text-zinc-400 shadow-[0_0_0_5px_#08090b]">
        {icon}
      </div>

      <p className="mt-4 text-[9px] font-semibold tracking-[0.14em] text-zinc-700">
        STEP {number}
      </p>

      <h3 className="mt-2 text-[13px] font-semibold text-zinc-200">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-[250px] text-[11px] leading-5 text-zinc-600">
        {text}
      </p>
    </div>
  );
}

/* ================================================================
   FLOW
================================================================ */

function FlowItem({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.018] px-3 py-3">
      <p className="text-[8px] font-semibold tracking-[0.12em] text-zinc-700">
        {number}
      </p>

      <p className="mt-1.5 text-[10px] font-medium text-zinc-400">
        {title}
      </p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="hidden items-center justify-center text-zinc-800 sm:flex">
      <ArrowRight />
    </div>
  );
}

/* ================================================================
   BULLET
================================================================ */

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.025] text-zinc-500">
        <CheckIcon />
      </div>

      <span className="text-[11px] text-zinc-500">
        {text}
      </span>
    </div>
  );
}

/* ================================================================
   USE CASE
================================================================ */

function UseCase({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d0f12] p-5 transition duration-200 hover:border-white/[0.1] hover:bg-[#101216]">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-zinc-500">
        {icon}
      </div>

      <h3 className="mt-6 text-[12px] font-semibold text-zinc-200">
        {title}
      </h3>

      <p className="mt-2 text-[10px] leading-5 text-zinc-600">
        {text}
      </p>
    </div>
  );
}

/* ================================================================
   ICONS
================================================================ */

function LinkIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
      <path d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 7 20l1.15-1.15" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3h7v7" />
      <path d="M10 14 21 3" />
      <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function Spinner() {
  return (
    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
  );
}

function ZapIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 3-4 3 2 5-7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function LayoutIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M3 9h18" />
      <path d="M9 9v12" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />
      <path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.5 9.5 0 0 1-4-.9L3 21l1.9-4.2A8.3 8.3 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 11 18-5v12L3 14v-3Z" />
      <path d="M11 15v5" />
      <path d="M7 16.5 6 20" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4" />
      <path d="m15.4 6.5-6.8 4" />
    </svg>
  );
}