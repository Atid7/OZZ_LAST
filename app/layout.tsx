import type React from "react";
import type { Metadata, Viewport } from "next";
import { DM_Sans, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/contexts/cart-context";
import { Toaster } from "react-hot-toast";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "OZ FOOD | Premium Street Food",
  description:
    "Artisan Kebabs, Smash Burgers & Tex-Mex - Fire-Cooked Perfection",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/Log.png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#141210" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${bebasNeue.variable} ${jetBrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <CartProvider>
            <Toaster position="top-right" />
            {children}
          </CartProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
