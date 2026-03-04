import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "../styles/globals.css";
import Providers from "../components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nok Strategic Advisory Board",
  description: "Executive portal for the Nok Strategic Advisory Board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        proxyUrl={process.env.NEXT_PUBLIC_CLERK_PROXY_URL}
        isSatellite
        signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
      >
        <body className={`${inter.variable} font-sans antialiased`}>
          <Providers>{children}</Providers>
        </body>
      </ClerkProvider>
    </html>
  );
}
