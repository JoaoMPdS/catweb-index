"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Home() {
	return (
		<main className="w-full h-full items-center flex flex-col gap-y-3 justify-center">
			<h1 className="text-5xl font-bold select-none">CatWeb Index</h1>
			<Link href="https://github.com/JoaoMPdS/catweb-index">
				<Button>
					<FaGithub />
					Contribute on GitHub
				</Button>
			</Link>
		</main>
	);
}
