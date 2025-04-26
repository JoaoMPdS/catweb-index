"use client";

import Image from "next/image";
import Link from "next/link";
import UserButton from "./auth/user-button";

export default function Topbar() {
   return (
      <nav className="sticky top-0 items-center bg-white flex justify-between py-4 outline-2 px-3 md:px-10">
         <Link href="/" className="flex gap-x-2 items-center">
            <Image width={512} height={512} className="w-10 h-10" src="/icon.svg" alt="icon" />
            <h1 className="text-2xl font-bold truncate text-black">
               CatWeb Index
            </h1>
         </Link>
         <UserButton />
      </nav>
   )
}