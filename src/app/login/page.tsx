import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08090b] px-4 text-zinc-100">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025]" />

        <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.018]" />

        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[390px]">
        {/* Brand */}
        <div className="mb-7 text-center">
          <a
            href="/"
            className="group inline-flex items-center gap-2.5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[12px] font-black text-black shadow-[0_0_30px_rgba(255,255,255,0.08)] transition duration-200 group-hover:scale-105">
              S
            </span>

            <span className="text-[15px] font-semibold tracking-[-0.025em] text-white">
              Shortly
            </span>
          </a>
        </div>

        {/* Login card */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0f12]/95 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          {/* Top glow */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.16] to-transparent" />

          <div className="p-6 sm:p-7">
            {/* Heading */}
            <div className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-zinc-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-4.5 w-4.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 8a3 3 0 1 0-6 0c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2Z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 20a7 7 0 0 1 14 0"
                  />
                </svg>
              </div>

         
              <p className="mx-auto mt-1.5 max-w-[280px] text-[11px] leading-5 text-zinc-600">
                Sign in to manage your links and view detailed analytics.
              </p>
            </div>

            {/* Google */}
            <div className="mt-7">
              <GoogleLoginButton />
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.06]" />

              <span className="text-[9px] uppercase tracking-[0.12em] text-zinc-700">
                Secure sign in
              </span>

              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>

            {/* Security */}
            <div className="rounded-lg border border-white/[0.05] bg-white/[0.018] p-3.5">
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.025] text-zinc-500">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-3.5 w-3.5"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                    />

                    <path
                      strokeLinecap="round"
                      d="M8 10V7a4 4 0 0 1 8 0v3"
                    />

                    <path
                      strokeLinecap="round"
                      d="M12 14v2"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-[10px] font-medium text-zinc-400">
                    Your account stays secure
                  </p>

                  <p className="mt-0.5 text-[9px] leading-4 text-zinc-700">
                    Shortly never stores your Google password. Authentication
                    is handled securely by Google.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/[0.05] px-6 py-3.5 text-center">
            <p className="text-[9px] text-zinc-700">
              One account · All your links · Complete analytics
            </p>
          </div>
        </div>

        {/* Back home */}
        <div className="mt-5 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-[10px] text-zinc-700 transition hover:text-zinc-400"
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

            Back to Shortly
          </a>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[9px] text-zinc-800">
          © {new Date().getFullYear()} Shortly
        </p>
      </div>
    </main>
  );
}