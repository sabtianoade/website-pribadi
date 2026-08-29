import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import PageTransitionProvider from "@/components/PageTransitionProvider";
import InitialLoader from "@/components/InitialLoader";
import ThomasAI from "@/components/ThomasAI";
import "./globals.css";
import { supabase } from "@/lib/supabase";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sabtiano.vercel.app"),
  title: "Thomas — Ruang Pribadiku",
  description:
    "Selamat datang di sudut kecilku di internet. Kenali aku — hobi, favorit, kepribadian, dan lebih banyak lagi.",
  keywords: ["Thomas", "website pribadi", "SMKN 1 Pasuruan", "RPL", "web developer"],
  authors: [{ name: "Thomas" }],
  openGraph: {
    title: "Thomas — Ruang Pribadiku",
    description: "Selamat datang di sudut kecilku di internet. Kenali aku — hobi, favorit, kepribadian, dan lebih banyak lagi.",
    url: "https://sabtiano.vercel.app",
    siteName: "Thomas Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thomas — Ruang Pribadiku",
    description: "Selamat datang di sudut kecilku di internet.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch Theme Color from Supabase Settings
  const { data: settingsData } = await supabase.from("site_settings").select("*");
  const primaryColor = settingsData?.find(s => s.id === "theme_primary_color")?.value || "#333333";

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root { --primary: ${primaryColor} !important; }
          .dark { --primary: ${primaryColor} !important; }
        ` }} />
      </head>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <InitialLoader />
          <PageTransitionProvider>
            {children}
            <ThomasAI />
          </PageTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
