"use client";

import {
   AlertDialog,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useTransition } from "react";

export type LogoutModalProps = {
   children: React.ReactNode;
   onClose?: () => unknown;
};

export default function LogoutDialog({
   children,
   onClose
} : LogoutModalProps) {
   const [disabled, startTransition] = useTransition();

   const onClick = () => {
      startTransition(async () => await signOut());
   }

   return (
      <AlertDialog onOpenChange={open => {if (!open) onClose?.()}}>
         <AlertDialogTrigger asChild>
            {children}
         </AlertDialogTrigger>

         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
               <AlertDialogDescription>
               This action will log you out of your account. You will need to log in again to access your data.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel className="border-none hover:bg-transparent" asChild><Button variant="link">Cancel</Button></AlertDialogCancel>
               <Button disabled={disabled} onClick={() => onClick()} variant="destructive">Logout</Button>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}