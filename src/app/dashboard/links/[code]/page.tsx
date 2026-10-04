import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import { authOptions } from "@/auth";
import pool from "@/lib/db";
import Header from "@/components/Header";
import AnalyticsPage from "@/components/analytics/AnalyticsPage";

export default async function LinkAnalyticsPage({
  params,
}: {
  params: {
    code: string;
  };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const [rows] = await pool.query(
    `
    SELECT id
    FROM short_urls
    WHERE short_code = ?
      AND user_id = ?
    LIMIT 1
    `,
    [params.code, userId]
  );

  const links = rows as { id: number }[];

  if (!links.length) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#08090b] text-zinc-100">
      <Header />

      <AnalyticsPage code={params.code} />
    </main>
  );
}
