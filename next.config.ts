// import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "tr.rbxcdn.com",
				pathname: "**"
			}
		]
	},
};

// if (process.env.NODE_ENV === 'development') {
// 	await setupDevPlatform();
// }

export default nextConfig;
