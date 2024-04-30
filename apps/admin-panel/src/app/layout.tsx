import { Rubik } from "next/font/google";

import AuthContext from "@/context/AuthContext";
import ToasterContext from "@/context/ToastContext";

import type { Metadata } from "next";

import "./globals.css";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin Panel for Telegram Bot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        <AuthContext>
          <ToasterContext />
          <div id="modal"></div>
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
