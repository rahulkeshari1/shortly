import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";

import pool from "@/lib/db";
import { authOptions } from "@/auth";

function generateShortCode(length = 7): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const randomBytes = crypto.randomBytes(length);

  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters[randomBytes[i] % characters.length];
  }

  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const url = String(body.url || "").trim();

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          message: "URL is required",
        },
        { status: 400 }
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid URL",
        },
        { status: 400 }
      );
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only HTTP and HTTPS URLs are allowed",
        },
        { status: 400 }
      );
    }

    /*
     * Get logged-in Google user.
     *
     * If there is no session, this is simply a guest URL.
     */
    const session = await getServerSession(authOptions);

    const userId = session?.user
      ? (session.user as any).id || null
      : null;

    let shortCode = "";
    let exists = true;

    while (exists) {
      shortCode = generateShortCode();

      const [rows] = await pool.query(
        `
        SELECT id
        FROM short_urls
        WHERE short_code = ?
        LIMIT 1
        `,
        [shortCode]
      );

      exists = (rows as any[]).length > 0;
    }

    const [result] = await pool.query(
      `
      INSERT INTO short_urls
      (
        user_id,
        short_code,
        original_url
      )
      VALUES (?, ?, ?)
      `,
      [
        userId,
        shortCode,
        url,
      ]
    );

    const insertedId = (result as any).insertId;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const shortUrl = `${baseUrl}/${shortCode}`;

    return NextResponse.json({
      success: true,

      message: session?.user
        ? "URL created and saved to your account"
        : "URL shortened successfully",

      data: {
        id: insertedId,
        shortCode,
        originalUrl: url,
        shortUrl,
        loggedIn: Boolean(session?.user),
      },
    });
  } catch (error) {
    console.error("Shorten URL error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
