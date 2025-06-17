import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ConvexClientProvider} from "@/components/provider/convex-provider";
import { Toaster } from 'sonner'
import {ModalProvider} from "@/components/provider/modal-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nowtion",
  description: "The connected workspace where better, faster work happens",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ` }
      >
        <ConvexClientProvider>
            <Toaster position={'bottom-right'}/>
            <ModalProvider />
            {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
