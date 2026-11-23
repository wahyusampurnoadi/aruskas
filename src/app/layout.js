import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";

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

// Script ini jalan sebelum render agar tidak ada kilatan tema yang salah
const themeInitScript = `(function(){try{var s=localStorage.getItem('aruskas-theme');var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');var r=document.documentElement;r.classList.add(t);r.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#030712" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#e8f0fe" media="(prefers-color-scheme: light)" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}