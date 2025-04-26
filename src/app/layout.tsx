import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import PromotionalDialog from "@/components/auth/promotional-dialog";
import Topbar from "../components/topbar";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "CatWeb Index",
	description: "An unofficial, community-maintained repository that tracks data related to the websites associated with the Roblox game CatWeb.",
	icons: {
		icon: "/favicon.svg",
	}
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-y-hidden`}
			>
				<SessionProvider>
					<Topbar />
					<div className="h-[87vh] over overflow-y-auto overflow-x-hidden">
						<div className="mt-[3vh] md:mt-0" />
						{children}
					</div>
					<PromotionalDialog />
					<Toaster position="bottom-right" />
				</SessionProvider>
			</body>
		</html>
	);
}
