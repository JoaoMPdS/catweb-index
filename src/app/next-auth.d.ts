import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
   robloxUserId: number,
};

declare module "next-auth" {
   interface Session {
      user: ExtendedUser
   }
}