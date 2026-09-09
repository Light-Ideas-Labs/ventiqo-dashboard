import 'mapbox-gl/dist/mapbox-gl.css';
import "./globals.css";

import { Inter, Geist } from 'next/font/google';
import { Metadata } from "next";

import Providers from '@/components/layouts/providers';
import { Toaster } from '@/components/ui/sonner';
import RootLayoutClient from "./layoutClient";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Ventiqo | Your Ultimate Event Hub",
  description: "Discover, plan, and elevate events with Ventiqo, the go-to platform for attendees and organizers alike. Explore a wide range of events, streamline event management, and create unforgettable experiences.",
  keywords: "event management, event platform, ticket sales, event marketing, event promotion",
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {

  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Providers>
          <Toaster />
          <RootLayoutClient>{children}</RootLayoutClient>
        </Providers>
      </body>
    </html>
  );
}
