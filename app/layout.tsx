import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import { ConfettiProvider } from "@/lib/providers/confetti-provider";

import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Jifunze Learning Platform",
	description:
		"Jifunze: Expand your knowledge without breaking the bank.  Affordable, high-quality online courses on the skills you need.",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<ClerkProvider
			appearance={{
				variables: { colorPrimary: "#0369a1" },
			}}
		>
			<html lang="en">
				<body className={montserrat.className}>
					{children}
					<Toaster />
					<ConfettiProvider />
				</body>
			</html>
		</ClerkProvider>
	);
};

export default RootLayout;
