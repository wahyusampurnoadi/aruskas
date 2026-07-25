import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ArusKas",
  description: "Track pendapatan dan pengeluaranmu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
        `}
      >
        <AuthProvider>{children}</AuthProvider>

        <Toaster position="top-right" richColors expand closeButton />
      </body>
    </html>
  );
}
