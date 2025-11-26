import type { Metadata } from "next";
import { Providers } from "../providers";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <main className="flex flex-1 flex-col overflow-x-hidden">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
