
import { NextAuthConfig } from "next-auth";
import Roblox from "next-auth/providers/roblox";

export default {
   providers: [
      Roblox({
         profile(profile) {
            return {
               id: String(profile.id),
            }
         }
      }),
   ],
} satisfies NextAuthConfig;