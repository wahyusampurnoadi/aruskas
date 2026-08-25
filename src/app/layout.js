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
  metadataBase: new URL("https://aruskas.web.id"),
  title: {
    default: "ArusKas - Aplikasi Pencatat Keuangan",
    template: "%s | ArusKas",
  },
  description: "Track pendapatan dan pengeluaranmu serta kelola keuangan secara praktis.",
  alternates: {
    canonical: "https://aruskas.web.id",
  },
  openGraph: {
    title: "ArusKas - Aplikasi Pencatat Keuangan",
    description: "Track pendapatan dan pengeluaranmu serta kelola keuangan secara praktis.",
    url: "https://aruskas.web.id",
    siteName: "ArusKas",
    locale: "id_ID",
    type: "website",
  },
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
