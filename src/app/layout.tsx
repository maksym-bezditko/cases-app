import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	display: "swap",
	variable: "--font-dm-sans",
});

export const metadata: Metadata = {
	title: "Clean App",
	description: "A clean, simplified app structure",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`antialiased ${dmSans.className}`}>
				{children}
			</body>
		</html>
	);
}
