import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Zero - Webrix",
  description: "HOW FAST CAN YOU BRING PROD DOWN? An interactive demo showcasing the importance of AI agent security.",
  keywords: ["AI security", "MCP", "prompt injection", "Webrix", "AI governance", "AI agents"],
  authors: [{ name: "Webrix" }],
  openGraph: {
    title: "Agent Zero - HOW FAST CAN YOU BRING PROD DOWN?",
    description: "An interactive booth demo for AI Dev TLV. Try to hack SENTINEL-9 and see how Webrix protects against AI agent attacks.",
    type: "website",
    images: [
      {
        url: "https://agent-zero.webrix.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Agent Zero - Webrix",
      },
    ],
    siteName: "Webrix",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent Zero - HOW FAST CAN YOU BRING PROD DOWN?",
    description: "An interactive booth demo for AI Dev TLV. Try to hack SENTINEL-9 and see how Webrix protects against AI agent attacks.",
    images: ["https://agent-zero.webrix.ai/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center">
        {children}
      </body>
    </html>
  );
}
