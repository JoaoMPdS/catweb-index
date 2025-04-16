"use client";

import { getUserHeadshot } from "@/actions/proxy";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";


export default function UserHeadshot({ 
   userId,
   className
} : { 
   userId: number,
   className?: string,
}) {
   const [image, setImage] = useState<string>();

   useEffect(() => {
      (async () => {
         try {
            const imageData = await getUserHeadshot(userId);
            setImage(imageData.data[0].imageUrl);
         } catch (err) {
            console.error(err);
         }
      })();
   }, [userId]);

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