import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModalProviders } from "@/components/providers/modal-providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Codebase Snippet Manager",
  description:
    "A codebase snippet manager for developers. Developed by Ryan Cuff and Twyman Lamb.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className}>
        <Toaster position="bottom-center" />
        <ModalProviders />
        {children}
      </body>
    </html>
  );
}
