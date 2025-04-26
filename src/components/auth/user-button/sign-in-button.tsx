"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { SiRoblox } from "react-icons/si";

export type SignInButtonProps = {
   className?: string,
}

export default function SignInButton({
   className
} : SignInButtonProps) {
   return (
      <Button 
         onClick={() => signIn("roblox", { redirectTo: window.location.pathname })}
         className={className}
      >
         <SiRoblox />
         Sign-in With Roblox
      </Button>
   );
}