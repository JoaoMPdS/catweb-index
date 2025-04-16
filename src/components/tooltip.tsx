import {
   Tooltip as DefaultTooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip"

export type TooltipProps = {
   children: React.ReactNode,
   message: string,
   side?: "top" | "right" | "bottom" | "left",
};

export default function Tooltip({  
   children,
   message,
   side
} : TooltipProps) {
   return (
      <TooltipProvider>
         <DefaultTooltip>
            <TooltipTrigger asChild>
               {children}
            </TooltipTrigger>
            <TooltipContent side={side || "top"}>
               {message}
            </TooltipContent>
         </DefaultTooltip>
      </TooltipProvider>
   );
}