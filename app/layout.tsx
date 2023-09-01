import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./header";
import { ThemeProvider } from "./providers/theme-provider";
import WagmiProvider from "./providers/wagmi-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Craftable",
  description: "ETHWARSAW Hachathon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WagmiProvider>
            <div className="p-4 md:p-24">
              <Header />
              {children}
            </div>
          </WagmiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
