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
  title: "Senda Consciente",
  description: "Un camino lujoso hacia la reencarnación y la abundancia. Descubre la ciencia real de la espiritualidad.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Senda Consciente",
    description: "Un camino lujoso hacia la reencarnación y la abundancia. Descubre la ciencia real de la espiritualidad.",
    type: "website",
    url: "https://conscious-path.vercel.app/",
    images: [
      {
        url: "https://opengraph.b-cdn.net/production/images/225abe7f-b14d-4bd8-a85c-c9514ea2dd1b.png?token=8rWMTH5--eURY-yJK0jzlRxo4oMUKBbzX0tq8Phkp0Q&height=188&width=86&expires=33290408049",
        width: 1200,
        height: 630,
        alt: "Senda Consciente",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Senda Consciente",
    description: "Un camino lujoso hacia la reencarnación y la abundancia. Descubre la ciencia real de la espiritualidad.",
    images: [
      "https://opengraph.b-cdn.net/production/images/225abe7f-b14d-4bd8-a85c-c9514ea2dd1b.png?token=8rWMTH5--eURY-yJK0jzlRxo4oMUKBbzX0tq8Phkp0Q&height=188&width=86&expires=33290408049",
    ],
  },
  alternates: {
    canonical: "https://conscious-path.vercel.app/",
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
