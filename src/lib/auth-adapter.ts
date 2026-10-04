import { randomUUID } from "crypto";
import type { Adapter } from "next-auth/adapters";
import pool from "@/lib/db";

export function MySQLAuthAdapter(): Adapter {
  return {
    async createUser(user) {
      const id = randomUUID();

      await pool.query(
        `
        INSERT INTO auth_users
        (id, name, email, emailVerified, image)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          id,
          user.name || null,
          user.email || null,
          user.emailVerified || null,
          user.image || null,
        ]
      );

      return {
        id,
        name: user.name || null,
        email: user.email || null,
        emailVerified: user.emailVerified || null,
        image: user.image || null,
      };
    },

    async getUser(id) {
      const [rows] = await pool.query(
        `
        SELECT id, name, email, emailVerified, image
        FROM auth_users
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

      const users = rows as any[];

      if (!users.length) {
        return null;
      }

      return users[0];
    },

    async getUserByEmail(email) {
      const [rows] = await pool.query(
        `
        SELECT id, name, email, emailVerified, image
        FROM auth_users
        WHERE email = ?
        LIMIT 1
        `,
        [email]
      );

      const users = rows as any[];

      if (!users.length) {
        return null;
      }

      return users[0];
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const [rows] = await pool.query(
        `
        SELECT
          u.id,
          u.name,
          u.email,
          u.emailVerified,
          u.image
        FROM auth_users u
        INNER JOIN auth_accounts a
          ON a.userId = u.id
        WHERE a.provider = ?
          AND a.providerAccountId = ?
        LIMIT 1
        `,
        [provider, providerAccountId]
      );

      const users = rows as any[];

      if (!users.length) {
        return null;
      }

      return users[0];
    },

    async updateUser(user) {
      await pool.query(
        `
        UPDATE auth_users
        SET
          name = ?,
          email = ?,
          emailVerified = ?,
          image = ?
        WHERE id = ?
        `,
        [
          user.name || null,
          user.email || null,
          user.emailVerified || null,
          user.image || null,
          user.id,
        ]
      );

      const updated = await this.getUser(user.id);

      if (!updated) {
        throw new Error("User not found after update");
      }

      return updated;
    },

    async deleteUser(userId) {
      await pool.query(
        `DELETE FROM auth_users WHERE id = ?`,
        [userId]
      );
    },

    async linkAccount(account) {
      await pool.query(
        `
        INSERT INTO auth_accounts
        (
          userId,
          type,
          provider,
          providerAccountId,
          refresh_token,
          access_token,
          expires_at,
          token_type,
          scope,
          id_token,
          session_state
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          account.userId,
          account.type,
          account.provider,
          account.providerAccountId,
          account.refresh_token || null,
          account.access_token || null,
          account.expires_at || null,
          account.token_type || null,
          account.scope || null,
          account.id_token || null,
          account.session_state || null,
        ]
      );

      return account;
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await pool.query(
        `
        DELETE FROM auth_accounts
        WHERE provider = ?
          AND providerAccountId = ?
        `,
        [provider, providerAccountId]
      );
    },

    async createSession({ sessionToken, userId, expires }) {
      await pool.query(
        `
        INSERT INTO auth_sessions
        (sessionToken, userId, expires)
        VALUES (?, ?, ?)
        `,
        [sessionToken, userId, expires]
      );

      return {
        sessionToken,
        userId,
        expires,
      };
    },

    async getSessionAndUser(sessionToken) {
      const [rows] = await pool.query(
        `
        SELECT
          s.sessionToken,
          s.userId,
          s.expires,

          u.id,
          u.name,
          u.email,
          u.emailVerified,
          u.image

        FROM auth_sessions s

        INNER JOIN auth_users u
          ON u.id = s.userId

        WHERE s.sessionToken = ?
        LIMIT 1
        `,
        [sessionToken]
      );

      const results = rows as any[];

      if (!results.length) {
        return null;
      }

      const row = results[0];

      return {
        session: {
          sessionToken: row.sessionToken,
          userId: row.userId,
          expires: row.expires,
        },

        user: {
          id: row.id,
          name: row.name,
          email: row.email,
          emailVerified: row.emailVerified,
          image: row.image,
        },
      };
    },

    async updateSession(session) {
      await pool.query(
        `
        UPDATE auth_sessions
        SET expires = ?
        WHERE sessionToken = ?
        `,
        [session.expires, session.sessionToken]
      );

      const result = await this.getSessionAndUser(session.sessionToken);

      return result?.session || null;
    },

    async deleteSession(sessionToken) {
      await pool.query(
        `
        DELETE FROM auth_sessions
        WHERE sessionToken = ?
        `,
        [sessionToken]
      );
    },

    async createVerificationToken(token) {
      await pool.query(
        `
        INSERT INTO auth_verification_tokens
        (identifier, token, expires)
        VALUES (?, ?, ?)
        `,
        [
          token.identifier,
          token.token,
          token.expires,
        ]
      );

      return token;
    },

    async useVerificationToken({ identifier, token }) {
      const [rows] = await pool.query(
        `
        SELECT identifier, token, expires
        FROM auth_verification_tokens
        WHERE identifier = ?
          AND token = ?
        LIMIT 1
        `,
        [identifier, token]
      );

      const tokens = rows as any[];

      if (!tokens.length) {
        return null;
      }

      await pool.query(
        `
        DELETE FROM auth_verification_tokens
        WHERE identifier = ?
          AND token = ?
        `,
        [identifier, token]
      );

      return tokens[0];
    },
  };
}
