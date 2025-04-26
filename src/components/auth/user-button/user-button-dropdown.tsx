"use client";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoLogOut } from "react-icons/io5";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LogoutDialog from "./logout-dialog";
 

export type UserButtonDropdownProps = {
   children: React.ReactNode,
   className?: string,
};

export default function UserButtonDropdown({
   children,
   className
} : UserButtonDropdownProps) {
   const [open, setOpen] = useState<boolean>(false);

   return (
      <DropdownMenu onOpenChange={setOpen} open={open}>
         <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
         <DropdownMenuContent className={cn("gap-y-1 flex flex-col", className)}>
            <LogoutDialog onClose={() => setOpen(false)}>
               <Button variant="ghost" className="p-2 cursor-pointer px-3 font-semibold w-full flex justify-start">
                  <IoLogOut style={{width: 23, height: 23}} />
                  Logout
               </Button>
            </LogoutDialog>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}