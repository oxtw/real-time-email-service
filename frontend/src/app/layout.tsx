import type { Metadata } from "next";
import "./globals.scss";
import {Inter} from 'next/font/google'

const inter = Inter ({ subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Real Time Email Service",
  description: "Sistema de Email",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
