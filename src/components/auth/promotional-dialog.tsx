"use client";

import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import SignInButton from "./user-button/sign-in-button";
import { useAppPromotionalModal } from "@/hooks/use-auth-promotional-modal";

export default function PromotionalDialog() {
   const [openReason, setOpen] = useAppPromotionalModal();

   return (
      <Dialog open={typeof(openReason) === "string"} onOpenChange={(open) => setOpen(open === false ? false : "voting")}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Unlock {String(openReason).charAt(0).toUpperCase() + String(openReason).slice(1)} and More!</DialogTitle>
               <DialogDescription>
                  Sign in with your Roblox account to enable site {openReason} and access additional features. <br />
                  We require authentication to ensure fair voting - one vote per user - and to help protect user privacy. <br />
                  We will only collect your Roblox user ID. <br />
               </DialogDescription>
            </DialogHeader>
            <DialogFooter>
               <SignInButton />
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}