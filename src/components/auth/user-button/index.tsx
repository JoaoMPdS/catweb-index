"use client";

import { useSession } from "next-auth/react";
import SignInButton from "./sign-in-button";
import { cn } from "@/lib/utils";
import UserName from "@/app/site/[...url]/_components/user-name";
import UserHeadshot from "@/app/site/[...url]/_components/user-headshot";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UserButtonDropdown from "./user-button-dropdown";

export type UserButtonProps = {
   className?: string,
};

export default function UserButton({
   className
} : UserButtonProps) {
   const { status, data } = useSession();

   return (
      <>
         {status === "loading" ? (
            <div className={cn("flex flex-row pl-2 pr-3 rounded-full gap-x-1 py-2", className)}>
               <div className="w-5 h-5 flex justify-center items-center rounded-full bg-foreground/15 p-[1px] text-white">
                  <Skeleton className="w-5 h-5" />
               </div>
               <div className="text-muted-foreground p-0">
               <Skeleton className="w-16 h-5" />
               </div>
            </div>
         ) : status === "unauthenticated" ? (
            <SignInButton className={className} />
         ) : (
            <UserButtonDropdown>
               <Button variant="ghost" className="pl-2 pr-3 rounded-full gap-x-1">
                  <div className="w-5 h-5 flex justify-center items-center rounded-full bg-foreground/15 p-[1px] text-white">
                     <UserHeadshot userId={data?.user.robloxUserId || 0} />
                  </div>
                  <div className="text-muted-foreground p-0">
                     <UserName userId={data?.user.robloxUserId || 0} />
                  </div>
               </Button>
            </UserButtonDropdown>
         )}
      </>
   );
}