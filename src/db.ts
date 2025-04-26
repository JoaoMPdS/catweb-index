import {
   boolean,
   timestamp,
   pgTable,
   text,
   primaryKey,
   integer,
   pgEnum,
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

export const users = pgTable("user", {
   id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
   robloxUserId: integer("robloxUserId").unique(),
   name: text("name"),
   email: text("email").unique(),
   emailVerified: timestamp("emailVerified", { mode: "date" }),
   image: text("image"),
})

export const accounts = pgTable(
   "account",
   {
      userId: text("userId")
         .notNull()
         .references(() => users.id, { onDelete: "cascade" }),
      type: text("type").$type<AdapterAccountType>().notNull(),
      provider: text("provider").notNull(),
      providerAccountId: text("providerAccountId").notNull(),
      refresh_token: text("refresh_token"),
      access_token: text("access_token"),
      expires_at: integer("expires_at"),
      token_type: text("token_type"),
      scope: text("scope"),
      id_token: text("id_token"),
      session_state: text("session_state"),
   },
   (account) => [
      {
         compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
         }),
      },
   ]
)

export const sessions = pgTable("session", {
   sessionToken: text("sessionToken").primaryKey(),
   userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
   expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
   "verificationToken",
   {
      identifier: text("identifier").notNull(),
      token: text("token").notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull(),
   },
   (verificationToken) => [
      {
         compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
         }),
      },
   ]
)

export const authenticators = pgTable(
   "authenticator",
   {
      credentialID: text("credentialID").notNull().unique(),
      userId: text("userId")
         .notNull()
         .references(() => users.id, { onDelete: "cascade" }),
      providerAccountId: text("providerAccountId").notNull(),
      credentialPublicKey: text("credentialPublicKey").notNull(),
      counter: integer("counter").notNull(),
      credentialDeviceType: text("credentialDeviceType").notNull(),
      credentialBackedUp: boolean("credentialBackedUp").notNull(),
      transports: text("transports"),
   },
   (authenticator) => [
      {
         compositePK: primaryKey({
            columns: [authenticator.userId, authenticator.credentialID],
         }),
      },
   ]
)

export const voteTypeEnum = pgEnum("vote_type", ["like", "dislike"]);

export const votes = pgTable(
   "vote",
   {
   userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

   site: text("site")
      .notNull(),

   vote: voteTypeEnum('vote')
      .notNull(),

   createdAt: timestamp("createdAt", { mode: "date" })
      .notNull()
      .$defaultFn(() => new Date()),
},
   (vote) => ({
      pk: primaryKey({ columns: [vote.userId, vote.site] }),
   })
)