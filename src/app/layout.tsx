import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google"; // Import standard fonts
import "./globals.css";
import { DemoProvider } from "@/lib/DemoContext";

const inter = Inter({ subsets: ["latin"] });
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Agentic UI Demo",
  description: "Mockup for ZeroUI, GenUI, Canvas flow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} ${notoSansJP.className} antialiased`}>
        <DemoProvider>
          {children}
        </DemoProvider>
      </body>
    </html>
  );
}
