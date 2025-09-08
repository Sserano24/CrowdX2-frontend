// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/components/authProvider";
import { ThemeProvider } from "@/components/themeProvider";
import { LoggedInNavbar, LoggedOutNavbar } from "@/components/Navbars";
import { getAccessToken, verifyAccessToken } from "@/lib/auth";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "CrowdX",
  description: "On-chain crowdfunding",
};

export const dynamic = "force-dynamic"; // optional: ensure per-request in dev

export default async function RootLayout({ children }) {
  const token = await getAccessToken();                 // ✅ await
  const isValid = token ? await verifyAccessToken(token) : false; // ✅ await

  // Optional: mask token if you ever log it
  console.log("Is the user logged in? ", isValid);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <AuthProvider>
          {isValid ? <LoggedInNavbar /> : <LoggedOutNavbar />}
          <main className="pt-4">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
