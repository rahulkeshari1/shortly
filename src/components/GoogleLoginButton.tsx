"use client";

import { signIn } from "next-auth/react";

export default function GoogleLoginButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
          fill="#4285F4"
        />

        <path
          d="M12 21.7c2.63 0 4.84-.87 6.46-2.35l-3.14-2.45c-.87.58-1.98.92-3.32.92-2.55 0-4.71-1.72-5.49-4.04H3.27v2.53A9.75 9.75 0 0 0 12 21.7Z"
          fill="#34A853"
        />

        <path
          d="M6.51 13.78A5.86 5.86 0 0 1 6.2 12c0-.62.11-1.22.31-1.78V7.69H3.27A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.06 1.02 4.31l3.24-2.53Z"
          fill="#FBBC05"
        />

        <path
          d="M12 6.18c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.27 14.63 2.3 12 2.3a9.75 9.75 0 0 0-8.73 5.39l3.24 2.53C7.29 7.9 9.45 6.18 12 6.18Z"
          fill="#EA4335"
        />
      </svg>

      Continue with Google
    </button>
  );
}
