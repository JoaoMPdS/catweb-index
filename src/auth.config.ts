
import { NextAuthConfig } from "next-auth";
import Roblox from "next-auth/providers/roblox";

export default {
   providers: [
      Roblox({
         profile(profile) {
            return {
               id: String(profile.sub ?? profile.id),
               name: profile.name ?? null,
               email: profile.email ?? null,
               robloxUserId: Number(profile.sub ?? profile.id), 
            };
         }
      }),
   ],
} satisfies NextAuthConfig;