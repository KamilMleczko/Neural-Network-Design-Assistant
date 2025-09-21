import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Neural Network Design Assistant",
  description: "A tool to assist with neural network design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main
          style={{
            overflowX: "hidden",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#1a0202ff",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
