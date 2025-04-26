import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { accounts, db, sessions, users, verificationTokens } from "@/db";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
   adapter: DrizzleAdapter(db,{
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
   }),
   session: { strategy: "jwt" },

   callbacks: {
      async jwt({ token }) {
         if (!token.sub) return token;

         const user = await db
            .select()
            .from(users)
            .where(eq(users.id, token.sub))
            .then((res) => res[0]);

         if (!user) return token;

         token.robloxUserId = user.robloxUserId;

         return token
      },
      
      async session({ session, token }) {
         if (token.robloxUserId && session.user) {
            session.user.robloxUserId = token.robloxUserId as number;
         }

         if (token.sub && session.user) {
            session.user.id = token.sub as string;
         }

         return session;
       },
   },

   events: {
      async signIn({ user, profile }) {
         if (profile?.sub) {
            const robloxUserId = Number(profile.sub);
            
            await db
               .update(users)
               .set({ robloxUserId })
               .where(eq(users.id, user.id as string));
         }
      }
   },

   ...authConfig,
});