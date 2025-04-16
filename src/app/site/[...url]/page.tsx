"use client";

import { useSiteData } from "@/hooks/use-site-data";
import { parseUrl } from "@/lib/url";
import { notFound, redirect, useParams } from "next/navigation";
import { AiOutlineLoading, AiOutlineExclamationCircle } from "react-icons/ai";

export const runtime = 'edge';

export default function SitePage() {
   const url = (useParams().url as string[]).join("/");

   const { hostname, resolvedUrl } = parseUrl(url as string);
   const { error, status } = useSiteData(hostname);
   if (error === 404) return notFound();

   if (status === "loaded") {
      return redirect(`https://roblox.com/games/start?launchData=${resolvedUrl}&placeId=16855862021`);
   }

   return (
      <div className="w-full h-full flex flex-col gap-y-1 justify-center items-center">
         {status === "loading" ? (
            <>
               <AiOutlineLoading className="text-3xl animate-spin" />
            </>
         ) : status === "error" ? (
            <div className="text-center items-center flex justify-center flex-col">
               <AiOutlineExclamationCircle className="text-5xl mb-2" />
               <h1 className="text-2xl font-bold">Something Went Wrong</h1>
               <p className="text-muted-foreground">Error Code: {error}</p>
            </div>
         ) : (
            <>
               <h1 className="text-4xl font-bold">Opening site...</h1>
               <p className="text-[108%] text-muted-foreground">This may take a while...</p>
            </>
         )}
      </div>
   );
}