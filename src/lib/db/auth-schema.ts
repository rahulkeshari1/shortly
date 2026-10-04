import {
  mysqlTable,
  varchar,
  text,
  datetime,
  int,
  primaryKey,
  unique,
} from "drizzle-orm/mysql-core";

export const authUsers = mysqlTable(
  "auth_users",
  {
    id: varchar("id", { length: 255 }).primaryKey(),

    name: varchar("name", { length: 255 }),

    email: varchar("email", { length: 255 }),

    emailVerified: datetime("emailVerified", {
      mode: "date",
    }),

    image: text("image"),
  },
  (table) => ({
    emailUnique: unique("auth_users_email_unique").on(table.email),
  })
);

export const authAccounts = mysqlTable(
  "auth_accounts",
  {
    userId: varchar("userId", { length: 255 }).notNull(),

    type: varchar("type", { length: 255 }).notNull(),

    provider: varchar("provider", { length: 255 }).notNull(),

    providerAccountId: varchar("providerAccountId", {
      length: 255,
    }).notNull(),

    refreshToken: text("refresh_token"),

    accessToken: text("access_token"),

    expiresAt: int("expires_at"),

    tokenType: varchar("token_type", {
      length: 255,
    }),

    scope: varchar("scope", {
      length: 255,
    }),

    idToken: text("id_token"),

    sessionState: varchar("session_state", {
      length: 255,
    }),
  },
  (table) => ({
    pk: primaryKey({
      columns: [
        table.provider,
        table.providerAccountId,
      ],
    }),
  })
);

export const authSessions = mysqlTable(
  "auth_sessions",
  {
    sessionToken: varchar("sessionToken", {
      length: 255,
    }).primaryKey(),

    userId: varchar("userId", {
      length: 255,
    }).notNull(),

    expires: datetime("expires", {
      mode: "date",
    }).notNull(),
  }
);

export const authVerificationTokens = mysqlTable(
  "auth_verification_tokens",
  {
    identifier: varchar("identifier", {
      length: 255,
    }).notNull(),

    token: varchar("token", {
      length: 255,
    }).notNull(),

    expires: datetime("expires", {
      mode: "date",
    }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [
        table.identifier,
        table.token,
      ],
    }),
  })
);
