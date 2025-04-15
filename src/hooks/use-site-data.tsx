import { useCallback, useEffect, useState } from "react";
import { Schema } from "../../json-schema/schema";
import axios from "axios";

export function useSiteData(site: string) {
   const [data, setData] = useState<Schema | null>(null);
   const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
   const [error, setError] = useState<number>();

   const load = useCallback(() => {
      axios(`https://raw.githubusercontent.com/JoaoMPdS/catweb-index/refs/heads/main/sites/${site}.json`).then(data => {   
         setError(0);
         setStatus("loaded");
         setData(data.data as Schema);
      }).catch(error => {
         setError(error.response.status || 500);
         setStatus("error");
         setData(null);
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