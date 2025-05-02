import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "NahMachine | Elegantly Say No",
  description: "Find the perfect reason to say no, beautifully presented.",
  openGraph: {
    title: "NahMachine | Elegantly Say No",
    description: "Find the perfect reason to say no, beautifully presented.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "NahMachine",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NahMachine | Elegantly Say No",
    description: "Find the perfect reason to say no, beautifully presented.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}