"use client";

import { useSiteData } from "@/hooks/use-site-data";
import { parseUrl } from "@/lib/url";
import { notFound, redirect, useParams } from "next/navigation";
import { useEffect } from "react";
import { AiOutlineLoading, AiOutlineExclamationCircle } from "react-icons/ai";

export const runtime = 'edge';

export default function SitePage() {
   const url = (useParams().url as string[]).join("/");

   const { hostname, resolvedUrl } = parseUrl(url as string);
   const { error, status, data } = useSiteData(hostname);
   
   useEffect(() => {
      const isRedirect = window.location.hash.toLocaleLowerCase() === "#redirect";
      
      if (status === "loaded" && isRedirect) {
         return redirect(`https://roblox.com/games/start?launchData=${resolvedUrl}&placeId=16855862021`);
      }
   }, [status, resolvedUrl])
   
   if (error === 404) return notFound();

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
            <div className="text-center">
               <h1 className="text-4xl font-bold">{hostname}.rbx</h1>
               <p className="text-[108%] text-muted-foreground">This page is a W.I.P.</p>
               <p className="text-muted-foreground">{JSON.stringify(data)}</p>
            </div>
         )}
      </div>
   );
}