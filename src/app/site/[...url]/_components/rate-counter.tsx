import { useEffect, useRef } from "react";
import { CountUp } from "countup.js";

export default function RateCounter({
   rate,
} : {
   rate: number | null,
}) {
   const ref = useRef<HTMLParagraphElement>(null);

   useEffect(() => {
      if (!ref.current) return;
      if (rate === null) {
         ref.current.textContent = "---"
         return;
      }

      const anim = new CountUp(ref.current!, rate, { suffix: "%" });
      if (!anim.error) {
         anim.start();
      } else {
         console.error(anim.error);
      }
   }, [rate, ref]);

   return (
      <p ref={ref} className="text-2xl font-bold translate-y-[-2px]">0%</p>
   );
}