import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/auth";
import pool from "@/lib/db";
import Header from "@/components/Header";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  /*
   * Get all links owned by this user.
   *
   * MAX(clicked_at) gives us the real last activity
   * for every individual short link.
   */
  const [rows] = await pool.query(
    `
    SELECT
      s.id,
      s.short_code,
      s.original_url,
      s.clicks,
      s.created_at,
      MAX(c.clicked_at) AS last_clicked_at
    FROM short_urls s
    LEFT JOIN click_logs c
      ON c.short_url_id = s.id
    WHERE s.user_id = ?
    GROUP BY
      s.id,
      s.short_code,
      s.original_url,
      s.clicks,
      s.created_at
    ORDER BY s.created_at DESC
    `,
    [userId]
  );

  const links = rows as {
    id: number;
    short_code: string;
    original_url: string;
    clicks: number;
    created_at: Date;
    last_clicked_at: Date | null;
  }[];

  /*
   * Overall clicks.
   */
  const totalClicks = links.reduce(
    (total, link) => total + Number(link.clicks),
    0
  );

  /*
   * Overall unique visitors.
   */
  const [uniqueRows] = await pool.query(
    `
    SELECT COUNT(DISTINCT c.ip_address) AS unique_visitors
    FROM click_logs c
    INNER JOIN short_urls s
      ON s.id = c.short_url_id
    WHERE s.user_id = ?
    `,
    [userId]
  );

  const uniqueVisitors = Number(
    (uniqueRows as any[])[0]?.unique_visitors || 0
  );

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";

  /*
   * Convert Dates to strings before sending them
   * to the client component.
   */
  const serializedLinks = links.map((link) => ({
    id: link.id,
    short_code: link.short_code,
    original_url: link.original_url,
    clicks: Number(link.clicks),
    created_at: new Date(link.created_at).toISOString(),
    last_clicked_at: link.last_clicked_at
      ? new Date(link.last_clicked_at).toISOString()
      : null,
  }));

  return (
    <main className="min-h-screen bg-[#08090b] text-zinc-100">
      <Header />

      <DashboardClient
        links={serializedLinks}
        baseUrl={baseUrl}
        totalClicks={totalClicks}
        uniqueVisitors={uniqueVisitors}
      />
    </main>
  );
}