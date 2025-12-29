import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HealthCare Blog – Evidence-Based Medical & Health Information",
    template: "%s | HealthCare Blog",
  },

  description:
    "HealthCare Blog publishes evidence-based medical articles on dermatology, gynecology, psychology, general medicine, and preventive health to promote awareness and informed health decisions.",

  keywords: [
    "medical blog",
    "healthcare information",
    "dermatology",
    "gynecology",
    "mental health",
    "psychology",
    "general medicine",
    "skin care",
    "women health",
    "preventive health",
  ],

  authors: [
    {
      name: "HealthCare Blog Medical Editorial Team",
    },
  ],

  creator: "Muhammad Sami Kamran",

  publisher: "HealthCare Blog",

  metadataBase: new URL("https://nextblog-blogging.vercel.app"),


  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    siteName: "HealthCare Blog",
    title: "HealthCare Blog – Trusted Medical Knowledge",
    description:
      "Doctor-reviewed medical blogs covering dermatology, psychology, general medicine, women’s health, and wellness awareness.",
    url: "https://nextblog-blogging.vercel.app",
    images: [
      {
        url: "https://nextblog-blogging.vercel.app/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "HealthCare Blog",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "HealthCare Blog – Medical Knowledge You Can Trust",
    description:
      "Doctor-reviewed blogs on dermatology, psychology, general medicine, and wellness.",
    images: ["https://nextblog-blogging.vercel.app/opengraph-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >

       <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <body className=" max-w-[1400px] w-[100%] mx-auto   ">
 <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}




