"use client";

import { getUserInfo } from "@/actions/proxy";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";


export default function UserName({ 
   userId,
   className
} : { 
   userId: number,
   className?: string,
}) {
   const [username, setUsername] = useState<string>();

   useEffect(() => {
      (async () => {
         try {
            const data = await getUserInfo(userId);
            setUsername(data.name);
         } catch (err) {
            console.error(err);
         }
      })();
   }, [userId]);

   return (
      <>
         {username ? (
            <p className={className}>@{username}</p>
         ) : (
            <Skeleton className="h-5 w-16" />
         )}
      </>
   );
}