"use client";

import { Card } from "@/components/ui/card";
import { SiteData, useSiteData } from "@/hooks/use-site-data";
import { getPathData, parseUrl } from "@/lib/url";
import { notFound, redirect, useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { AiOutlineLoading, AiOutlineExclamationCircle } from "react-icons/ai";
import SiteThumbnail from "./_components/site-thumbnail";
import UserHeadshot from "./_components/user-headshot";
import { Button } from "@/components/ui/button";
import UserName from "./_components/user-name";
import Link from "next/link";
import { FaArrowUpRightFromSquare, FaPaperclip, FaCalendar, FaGithub, FaChartColumn, FaCookie, FaThumbsUp, FaThumbsDown, FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa6";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { format, formatDistanceToNow } from "date-fns";
import Tooltip from "@/components/tooltip";
import { dateFromString } from "@/lib/date";
import VisitsCounter from "./_components/vists-counter";
import { BsStars } from "react-icons/bs";
import { dislike, getVote, like } from "@/actions/ratings";
import { voteTypeEnum } from "@/db";
import RateCounter from "./_components/rate-counter";
import { useAppPromotionalModal } from "@/hooks/use-auth-promotional-modal";

export const runtime =  'edge';

export default function SitePage() {
   const [, setAuthPromoModalOpen] = useAppPromotionalModal();
   const [isLiking, setIsLiking] = useState<typeof voteTypeEnum.enumValues[number] | null | undefined>(undefined);
   const [disabled, startTransition] = useTransition();
   const url = (useParams()?.url as string[]).join("/");

   const { hostname, resolvedUrl } = parseUrl(url as string);
   const { error, status, data: siteData, update } = useSiteData(hostname);
   const rating = siteData?.rating ?? null;
   const data: SiteData | null = Object.entries(siteData).length <= 1 ? null : siteData as SiteData;
   const catwebLaunchURL = `https://roblox.com/games/start?launchData=${resolvedUrl}&placeId=16855862021`;
   
   useEffect(() => {
      const isRedirect = window.location.hash.toLocaleLowerCase() === "#redirect";
      
      if (status === "loaded" && isRedirect) {
         return redirect(catwebLaunchURL);
      }
      
   }, [status, resolvedUrl, catwebLaunchURL]);
   
   useEffect(() => {
      getVote(hostname).then(data => {
         if (data.error === "You are not authenticated") return setIsLiking(null); // allow unauthenticated users to press the buttons
         if (data.error) {
            toast.error("Something went wrong while loading your rating on this site.");
            console.error(data.error);
            return;
         }
         setIsLiking(data.success ?? null);
      });
   }, [hostname]);

   if (error === 404) return notFound();

   let pathData;
   if (data) {
      pathData = getPathData(parseUrl(url as string), data);
   }

   const onShareLinkCopy = () => {
      navigator.clipboard.writeText(new URL(`/preview/${resolvedUrl}`, window.location.href).href);
      toast.success("Successfully copied the share URL to the clipboard.");
   };

   const onLike = () => {
      startTransition(async () => {
         const res = await like(hostname);
         if (res.error === "You are not authenticated") return setAuthPromoModalOpen("voting");
         if (res.error || !res.success) {
            toast.error(res.error || "Something went wrong!")
            return;
         }

         setIsLiking(res.success === "added" ? "like" : null);
         await update();
      });
   };
   const onDislike = () => {
      startTransition(async () => {
         const res = await dislike(hostname);
         if (res.error === "You are not authenticated") return setAuthPromoModalOpen("voting");
         if (res.error || !res.success) {
            toast.error(res.error || "Something went wrong!")
            return;
         }

         setIsLiking(res.success === "added" ? "dislike" : null);
         await update();
      });
   }

   const creationDate = data && data.createdAt && dateFromString(data?.createdAt);
   
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
            <div className="text-center w-[90%] md:w-[80%] xl:w-[70%] flex gap-y-[12px] flex-col">
               <Card className="w-full flex flex-col md:flex-row items-center justify-between py-4 px-2 md:px-7">
                  <div className="flex gap-x-3 items-center mr-auto ml-0">
                     <div className="w-16 h-16 p-[13px] bg-foreground rounded-full flex justify-center items-center">
                        <SiteThumbnail assetId={pathData?.iconId ?? null} className="text-white" />
                     </div>
                     <div>
                        <p className="text-xl font-bold text-left">
                           {pathData?.title || resolvedUrl}
                        </p>
                        {data?.creatorId && (
                           <Link href={`https://www.roblox.com/users/${data?.creatorId}/profile`} target="_blank">
                              <div className="flex flex-row items-center gap-x-1">
                                 <div className="w-5 h-5 flex justify-center items-center rounded-full bg-foreground/15 p-[1px] text-white">
                                    <UserHeadshot userId={data?.creatorId || 0} />
                                 </div>
                                    <Button variant="link" className="text-muted-foreground p-0">
                                       <UserName userId={data?.creatorId || 0} />
                                    </Button>
                              </div>
                           </Link>
                        )}
                     </div>
                  </div>

                  <div className="text-center items-center flex justify-center gap-x-2">
                     <Button onClick={() => onShareLinkCopy()} variant="outline">
                        <FaPaperclip />
                        Copy Share Link
                     </Button>
                     <Link href={catwebLaunchURL}>
                        <Button>
                           Open In CatWeb
                           <FaArrowUpRightFromSquare style={{ height: 16, width: 16 }} />
                        </Button>
                     </Link>
                  </div>
               </Card>
               
               <div className="flex flex-col md:flex-row gap-x-2 gap-y-[12px]">
                  <Tooltip message={data?.visits ? `Updated ${formatDistanceToNow(dateFromString(data.visits.updatedAt), { addSuffix: true })}.` : "There is no information to display about this site."} side="bottom">
                     <Card className="p-4 w-full flex flex-row justify-start items-center gap-x-3 px-5">
                        <FaChartColumn className="text-5xl" />
                        <div className="flex justify-start items-start flex-col">
                           <p className="font-semibold">Visits:</p>
                           <VisitsCounter visitsCount={data?.visits.current ?? null} />
                        </div>
                     </Card>
                  </Tooltip>
                  <Tooltip message={data?.website_type ? "The theme of this website." : "There is no information to display about this site."} side="bottom">
                     <Card className="p-4 w-full flex flex-row justify-start items-center gap-x-3 px-5">
                        <FaCookie className="text-5xl" />
                        <div className="flex justify-start items-start flex-col">
                           <p className="font-semibold">Type:</p>
                           <p className="text-2xl font-bold translate-y-[-2px]">
                              {data?.website_type.replaceAll("_", " ").trim().replace(/(^\w|\s\w)/g, match => match.toUpperCase()) || "---"}
                           </p>
                        </div>
                     </Card>
                  </Tooltip>
               </div>

               <Tooltip message="What does the community think about this site?" side="bottom">
                  <Card className="p-4 w-full flex flex-row justify-between items-center px-5">
                     <div className="flex flex-row gap-x-2 justify-start">
                        <BsStars className="text-5xl" />
                        <div className="flex justify-start items-start flex-col">
                           <p className="font-semibold truncate">Satisfaction Rate:</p>
                           <RateCounter rate={rating} />
                        </div>
                     </div>
                     <div className="flex flex-row gap-x-1">
                        <Button disabled={isLiking === undefined || disabled} onClick={() => onLike()} className="py-6" variant="ghost">
                           {isLiking === "like" ? (
                              <FaThumbsUp className="size-6" />
                           ) : (
                              <FaRegThumbsUp className="size-6" />
                           )}
                        </Button>

                        <Button disabled={isLiking === undefined || disabled} onClick={() => onDislike()} className="py-6" variant="ghost">
                           {isLiking === "dislike" ? (
                              <FaThumbsDown className="size-6" />
                           ) : (
                              <FaRegThumbsDown className="size-6" />
                           )}
                        </Button>
                     </div>
                  </Card>
               </Tooltip>

               <Card className="p-4 text-left flex gap-y-1">
                  <Label className="uppercase text-muted-foreground font-bold">
                     Description
                  </Label>
                  <p>{pathData?.description || "No information is available for this page."}</p>
                  
                  {creationDate ? (
                     <div className="mt-[4px] font-medium text-muted-foreground flex items-center gap-x-2">
                        <FaCalendar />
                        <p>
                           {format(creationDate, "PPpp").replace(/:\d{2}\s/, ' ')} 
                        </p>
                        <p className="hidden md:block">
                           ({formatDistanceToNow(creationDate, { addSuffix: true })})
                        </p>
                     </div>
                  ) : (
                     <Link target="_blank" className="mt-1" href={`https://github.com/JoaoMPdS/catweb-index/new/main/sites?filename=${hostname}.json`}>
                        <Button>
                           <FaGithub />
                           Add More Information on GitHub
                        </Button>
                     </Link>
                  )}
               </Card>
            </div>
         )}
      </div>
   );
}