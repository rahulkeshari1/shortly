"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function ProfileMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="h-8 w-20 animate-pulse rounded-md border border-white/[0.06] bg-white/[0.03]" />
    );
  }

  if (!session?.user) {
    return (
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="h-8 rounded-md bg-white px-3.5 text-[11px] font-semibold text-black transition hover:bg-zinc-200"
      >
        Sign in
      </button>
    );
  }

  const initial =
    session.user.name?.charAt(0).toUpperCase() ||
    session.user.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <div className="relative">
      {/* Profile trigger */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Open profile menu"
        className="group flex h-8 items-center gap-2 rounded-md border border-white/[0.07] bg-white/[0.025] px-1.5 pr-2 transition hover:border-white/[0.12] hover:bg-white/[0.05]"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "Profile"}
            className="h-6 w-6 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[10px] font-bold text-black">
            {initial}
          </div>
        )}

        <div className="hidden max-w-[110px] text-left sm:block">
          <p className="truncate text-[10px] font-medium leading-3 text-zinc-300">
            {session.user.name || "User"}
          </p>

          <p className="mt-0.5 truncate text-[9px] leading-3 text-zinc-600">
            {session.user.email}
          </p>
        </div>

        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          className={`ml-0.5 text-zinc-600 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Mobile/backdrop */}
          <button
            type="button"
            aria-label="Close profile menu"
            className="fixed inset-0 z-40 cursor-default bg-transparent"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-10 z-50 w-60 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0f12] p-1.5 shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
            {/* Account information */}
            <div className="mb-1 border-b border-white/[0.06] px-2.5 pb-3 pt-2">
              <div className="flex items-center gap-2.5">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Profile"}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[11px] font-bold text-black">
                    {initial}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-zinc-200">
                    {session.user.name || "User"}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-zinc-600">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Dashboard */}
            <a
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-medium text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className="text-zinc-600 transition group-hover:text-zinc-300"
              >
                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <rect
                  x="14"
                  y="3"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <rect
                  x="3"
                  y="14"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <rect
                  x="14"
                  y="14"
                  width="7"
                  height="7"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
              </svg>

              <span className="flex-1">Dashboard</span>

              <span className="text-[9px] text-zinc-700">⌘D</span>
            </a>

            {/* Profile */}
            <a
              href="/profile"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-medium text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className="text-zinc-600 transition group-hover:text-zinc-300"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />

                <path
                  d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>

              <span>Profile</span>
            </a>

            {/* Divider */}
            <div className="my-1 border-t border-white/[0.05]" />

            {/* Sign out */}
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[11px] font-medium text-zinc-500 transition hover:bg-red-500/[0.06] hover:text-red-400"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className="text-zinc-600 transition group-hover:text-red-400"
              >
                <path
                  d="M10 17l5-5-5-5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M15 12H3"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                <path
                  d="M13 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>

              <span>Sign out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
