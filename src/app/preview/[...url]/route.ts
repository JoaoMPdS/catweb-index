import { getPathData, parseUrl } from "@/lib/url";
import axios from "axios";
import { notFound, redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { Schema } from "../../../../json-schema/schema";

export const runtime = 'edge';

const websiteTypeColors = {
   "gaming": "#1E90FF",
   "educational": "#00BFFF",
   "scripting": "#00FF9F",
   "tools": "#708090",
   "domain_selling": "#7851A9",
   "empty": "#CCCCCC",
   "social": "#FF5E9D",
   "news": "#DC143C",
   "misc": "#FF7F50"
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ url: string[] }> }) {
   const userAgent = req.headers.get("user-agent") || '';
   const isDiscord = userAgent.toLowerCase().includes("discordbot");
   
   const url = (await params).url.join("/");
   const parsedUrl = parseUrl(url as string);

   if (!isDiscord) {
      return redirect(`/site/${parsedUrl.resolvedUrl}#redirect`);
   }

   let data;
   try {
      data = await axios(`https://raw.githubusercontent.com/JoaoMPdS/catweb-index/refs/heads/main/sites/${parsedUrl.hostname}.json`);
   } catch {
      data = {};   
   }

   const pathData = getPathData(parsedUrl, data.data);
   if (!pathData) return notFound();

   let imageURL: string | undefined;
   try {
      if (pathData.iconId) {
         const imageData = (await axios(`https://thumbnails.roblox.com/v1/assets?assetIds=${pathData.iconId || 96094941435895}&format=Png&size=420x420`)).data;
         imageURL = imageData.data[0].imageUrl;
      }
   } catch {
      imageURL = undefined;
   }

   const siteColor: string = websiteTypeColors[((data.data as Schema | undefined)?.website_type as keyof typeof websiteTypeColors) || "empty"];

   return new NextResponse(`
      <html lang="en"><head>
         <meta name="theme-color" content="${siteColor}">
         <meta property="og:title" content="${pathData.title}" />
         ${imageURL ? `<meta property="og:image" content="${imageURL}" />` : ""}
         <meta property="og:description" content="${pathData.description || "No information is available for this page."}" />
         <meta property="og:url" content="https://roblox.com/games/start?launchData=${parsedUrl.resolvedUrl}&placeId=16855862021" />
         <meta property="og:type" content="website" />         
      </head></html>
   `, {
      headers: { "Content-Type": "text/html" }
   });
}