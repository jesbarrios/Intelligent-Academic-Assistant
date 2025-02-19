import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import NextAuthProvider from "@/components/session-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Head from "next/head";

const font = Space_Grotesk({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Intelligent Academic Assistant",
  description:
    "Project Developed By Jesus Barrios and Cristian Reyes. Submitted to the Long Island Youth Summit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextAuthProvider>
      <html lang="en" suppressHydrationWarning>
        <Head>
          <title>Intelligent Academic Assistant</title>
          <meta
            name="description"
            content="Project Developed By Jesus Barrios and Cristian Reyes. Submitted to the Long Island Youth Summit."
          />
          <link rel="icon" type="image/png" href="/app/icon.png" />
          <meta property="og:title" content="Intelligent Academic Assistant" />
          <meta
            property="og:description"
            content="Project Developed By Jesus Barrios and Cristian Reyes. Submitted to the Long Island Youth Summit."
          />
        </Head>
        <body className={`${font.className}`} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main className="sm:px-10 px-5">{children}</main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </NextAuthProvider>
  );
}
