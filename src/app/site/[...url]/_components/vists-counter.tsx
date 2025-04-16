import { useEffect, useRef } from "react";
import { CountUp } from "countup.js";

export default function VisitsCounter({
   visitsCount
} : {
   visitsCount: number | null
}) {
   const ref = useRef<HTMLParagraphElement>(null);

   useEffect(() => {
      if (!ref.current) return;
      if (!visitsCount) {
         ref.current.textContent = "---"
         return;
      }

      const anim = new CountUp(ref.current!, visitsCount);
      if (!anim.error) {
         anim.start();
      } else {
         console.error(anim.error);
      }
   }, [visitsCount, ref]);

   return (
      <p ref={ref} className="text-2xl font-bold translate-y-[-2px]">0</p>
   );
}