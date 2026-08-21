import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import PageTransitionProvider from "@/components/PageTransitionProvider";
import InitialLoader from "@/components/InitialLoader";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thomas — Ruang Pribadiku",
  description:
    "Selamat datang di sudut kecilku di internet. Kenali aku — hobi, favorit, kepribadian, dan lebih banyak lagi.",
  keywords: ["Thomas", "website pribadi", "SMKN 1 Pasuruan", "RPL", "web developer"],
  authors: [{ name: "Thomas" }],
  openGraph: {
    title: "Thomas — Ruang Pribadiku",
    description: "Selamat datang di sudut kecilku di internet.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
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
          </PageTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
