import { getPathData, parseUrl } from "@/lib/url";
import axios from "axios";
import { notFound, redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req: NextRequest, { params }: { params: Promise<{ url: string[] }> }) {
   const userAgent = req.headers.get("user-agent") || '';
   const isDiscord = userAgent.toLowerCase().includes("discordbot");
   
   const url = (await params).url.join("/");
   const parsedUrl = parseUrl(url as string);

   if (!isDiscord) {
      return redirect(`/site/${parsedUrl.resolvedUrl}`);
   }

   let data;
   try {
      data = await axios(`https://raw.githubusercontent.com/JoaoMPdS/catweb-index/refs/heads/main/sites/${parsedUrl.hostname}.json`);
   } catch {
      return notFound();
   }

   const pathData = getPathData(parsedUrl, data.data);
   if (!pathData) return notFound();

   return new NextResponse(`
      <html lang="en"><head>
         <meta property="og:title" content="${pathData.title}" />
         ${pathData?.iconId ? `<meta property="og:image" content="https://www.roblox.com/asset-thumbnail/image?assetId=${pathData?.iconId}&width=420&height=420&format=png" />` : ""}
         ${pathData?.description ? `<meta property="og:description" content="${pathData.description}" />` : ""}
         <meta property="og:url" content="https://roblox.com/games/start?launchData=${parsedUrl.resolvedUrl}&placeId=16855862021" />
         <meta property="og:type" content="website" />         
      </head></html>
   `, {
      headers: { "Content-Type": "text/html" }
   });
}