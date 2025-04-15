"use client";

import { useSiteData } from "@/hooks/use-site-data";
import { getPathData, parseUrl } from "@/lib/url";
import { useParams, usePathname } from "next/navigation";

export default function MetaTags() {
   const params = useParams();
   const url = ((params.url as string[]) || []).join("/");
   const parsedUrl = parseUrl(url as string);
   const { data, status } = useSiteData(parsedUrl.hostname);
   
   
   if (!usePathname().startsWith("/site/")) return;
   if (status !== "loaded") return;
   if (!data) return;
   
   const pathData = getPathData(parsedUrl, data);
   if (!pathData) return;

   return (
      <>
         <meta property="og:title" content={pathData?.title} />
         <meta property="og:description" content={pathData.description} />
         {pathData?.iconId && (
            <meta property="og:image" content={`https://www.roblox.com/asset-thumbnail/image?assetId=${pathData?.iconId}&width=420&height=420&format=png`} />
         )}
         <meta property="og:url" content={`https://roblox.com/games/start?launchData=${parsedUrl.resolvedUrl}&placeId=16855862021`} />
         <meta property="og:type" content="website" />
      </>
   );
}