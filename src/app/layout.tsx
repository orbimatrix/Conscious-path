import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Senda Consciente | Reencarnación, Abundancia y Vida Espiritual",
  description: "Descubre un enfoque lujoso y exclusivo hacia la reencarnación, la abundancia y la salud holística. En Senda Consciente, unimos la ciencia real con la espiritualidad para transformar tu vida.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Senda Consciente",
    description: "Un camino lujoso hacia la reencarnación y la abundancia. Descubre la ciencia real de la espiritualidad.",
    type: "website",
    images: [
      {
        url: "/icon1.jpg",
        width: 1200,
        height: 630,
        alt: "Senda Consciente",
      },
    ],
  },
  alternates: {
    canonical: "https://www.sendaconsciente.com",
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
        <meta name="apple-mobile-web-app-title" content="Senda Consciente" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
