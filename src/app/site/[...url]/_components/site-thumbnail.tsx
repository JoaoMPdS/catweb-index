"use client";

import { getThumbnailData } from "@/actions/proxy";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";


export default function SiteThumbnail({ 
   assetId,
   className
} : { 
   assetId: number | null,
   className?: string,
}) {
   const [image, setImage] = useState<string>();
   assetId = assetId || 96094941435895;

   useEffect(() => {
      (async () => {
         try {
            const imageData = await getThumbnailData(assetId);
            setImage(imageData.data[0].imageUrl);
         } catch (err) {
            console.error(err);
         }
      })();
   }, [assetId]);

   return (
      <>
         {image ? (
            <Image className={className} src={image} alt="Website Thumbnail" width={420} height={420} />
         ) : (
            <AiOutlineLoading className={cn("animate-spin text-xl", className)} />
         )}
      </>
   );
}