import { useCallback, useEffect, useState } from "react";
import { Schema } from "../../json-schema/schema";
import axios from "axios";
import { getRating } from "@/actions/ratings";

export type SiteData = {
   rating?: number,
} & Schema;

export function useSiteData(site: string) {
   const [data, setData] = useState<SiteData | { rating?: number }>({});
   const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
   const [error, setError] = useState<number>();

   const load = useCallback(() => {
      axios(`https://raw.githubusercontent.com/JoaoMPdS/catweb-index/refs/heads/main/sites/${site}.json`).then(async data => {   
         setError(0);
         setStatus("loaded");
         setData({...data.data, rating: await getRating(site)});
      }).catch(async error => {
         if (error.response.status === 404) {
            setError(0);
            setStatus("loaded");
            setData({ rating: (await getRating(site)) ?? undefined });
         } else {
            setError(error.response.status || 500);
            setStatus("error");
            setData({ rating: (await getRating(site)) ?? undefined });
         }
      });
   }, [site]);

   useEffect(() => {
      let isMounted = true;

      if (isMounted) {
         load();
      }

      const interval = setInterval(() => {
         if (isMounted) load();
      }, 5000);

      return () => {
         clearInterval(interval);
         isMounted = false;
      };
   }, [load]);

   return { data, status, error, update: load };
}