import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/auth";
import Header from "@/components/Header";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const initial =
    session.user.name?.charAt(0).toUpperCase() ||
    session.user.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <main className="min-h-screen bg-[#08090b] text-zinc-100">
      <Header />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-7">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
            Account
          </div>

          <h1 className="mt-2 text-[22px] font-semibold tracking-[-0.025em] text-white">
            Your profile
          </h1>

          <p className="mt-1 text-[12px] text-zinc-500">
            Manage your Shortly account and authentication details.
          </p>
        </div>

        {/* Profile card */}
        <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#0d0f12]">
          {/* Identity */}
          <div className="border-b border-white/[0.06] p-5 sm:p-6">
            <div className="flex items-center gap-4">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "Profile"}
                  className="h-14 w-14 rounded-xl object-cover ring-1 ring-white/[0.08]"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-lg font-bold text-black">
                  {initial}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-[14px] font-semibold text-white">
                    {session.user.name || "User"}
                  </h2>

                  <span className="rounded-md border border-emerald-400/10 bg-emerald-400/[0.06] px-1.5 py-0.5 text-[9px] font-medium text-emerald-400">
                    Active
                  </span>
                </div>

                <p className="mt-1 truncate text-[11px] text-zinc-500">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Account information */}
          <div className="grid sm:grid-cols-2">
            {/* Authentication */}
            <div className="border-b border-white/[0.06] p-5 sm:border-b-0 sm:border-r sm:p-6">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.025]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42Z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 21.99c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.99Z"
                    />
                    <path
                      fill="currentColor"
                      d="M6.54 14.08A5.86 5.86 0 0 1 6.24 12c0-.72.12-1.42.3-2.08V7.39H3.29A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.61l3.25-2.53Z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.89c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 2.99 14.63 2 12 2a9.75 9.75 0 0 0-8.71 5.39l3.25 2.53C7.31 7.61 9.46 5.89 12 5.89Z"
                    />
                  </svg>
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Authentication
                </p>
              </div>

              <p className="mt-4 text-[13px] font-medium text-zinc-200">
                Google
              </p>

              <p className="mt-1.5 text-[11px] leading-5 text-zinc-600">
                Your Shortly account is secured through Google authentication.
              </p>
            </div>

            {/* Account status */}
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.025]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-3.5 w-3.5 text-zinc-400"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75"
                    />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Account status
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <p className="text-[13px] font-medium text-zinc-200">
                  Active
                </p>
              </div>

              <p className="mt-1.5 text-[11px] leading-5 text-zinc-600">
                Your Shortly account is active and ready to create short links.
              </p>
            </div>
          </div>
        </div>

        {/* Account details */}
        <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.07] bg-[#0d0f12]">
          <div className="border-b border-white/[0.06] px-5 py-4">
            <p className="text-[11px] font-semibold text-zinc-300">
              Account details
            </p>

            <p className="mt-0.5 text-[10px] text-zinc-600">
              Information associated with your Shortly account.
            </p>
          </div>

          <div className="divide-y divide-white/[0.05]">
            <div className="flex items-center justify-between gap-5 px-5 py-4">
              <div>
                <p className="text-[10px] text-zinc-600">Name</p>
                <p className="mt-1 text-[12px] text-zinc-300">
                  {session.user.name || "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-5 px-5 py-4">
              <div className="min-w-0">
                <p className="text-[10px] text-zinc-600">Email</p>
                <p className="mt-1 truncate text-[12px] text-zinc-300">
                  {session.user.email || "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-5 px-5 py-4">
              <div>
                <p className="text-[10px] text-zinc-600">Sign-in provider</p>
                <p className="mt-1 text-[12px] text-zinc-300">Google</p>
              </div>

              <span className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[9px] font-medium text-zinc-500">
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-5 text-center text-[10px] text-zinc-700">
          Your authentication is managed securely through Google.
        </p>
      </div>
    </main>
  );
}