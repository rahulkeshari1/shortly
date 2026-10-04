import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import pool from "@/lib/db";
import { authOptions } from "@/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID not found",
        },
        { status: 401 }
      );
    }

    const [rows] = await pool.query(
      `
      SELECT
        id,
        short_code,
        original_url,
        clicks,
        created_at
      FROM short_urls
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const links = (rows as any[]).map((link) => ({
      id: link.id,
      shortCode: link.short_code,
      shortUrl: `${baseUrl}/${link.short_code}`,
      originalUrl: link.original_url,
      clicks: Number(link.clicks),
      createdAt: link.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: links,
    });
  } catch (error) {
    console.error("Get links error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load links",
      },
      { status: 500 }
    );
  }
}
