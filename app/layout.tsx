import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'sonner'; // Import the notification engine
import "./globals.css";

const geistSans = Geist({
variable: "--font-geist-sans",
subsets: ["latin"],
});

const geistMono = Geist_Mono({
variable: "--font-geist-mono",
subsets: ["latin"],
});

export const metadata: Metadata = {
title: "Elite-Pulse | Real-Time Monitor",
description: "High-performance infrastructure dashboard built with Next.js and Supabase",
};

export default function RootLayout({
children,
}: Readonly<{
children: React.ReactNode;
}>) {
return (
<html
lang="en"
className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
>
<body className="min-h-full flex flex-col bg-[#050505]">
{/* The main content of your app */}
{children}

{/* The Notification Engine: Stays on top of everything */}
<Toaster theme="dark" position="top-center" richColors />
</body>
</html>
);
}
