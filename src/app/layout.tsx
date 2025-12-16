import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "Agent Zero - Webrix",
  description: "A quest to find the ultimate hacker. HOW FAST CAN YOU NUKE THE REPO? An interactive demo showcasing the importance of AI agent security.",
  keywords: ["AI security", "MCP", "prompt injection", "Webrix", "AI governance", "AI agents"],
  authors: [{ name: "Webrix" }],
  openGraph: {
    title: "Agent Zero - HOW FAST CAN YOU NUKE THE REPO?",
    description: "A quest to find the ultimate hacker. Try to hack the AI agent and see how Webrix protects against AI agent attacks.",
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
    title: "Agent Zero - HOW FAST CAN YOU NUKE THE REPO?",
    description: "A quest to find the ultimate hacker. Try to hack the AI agent and see how Webrix protects against AI agent attacks.",
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
      <body className="h-dvh max-h-dvh overflow-hidden">
        {children}
      </body>
    </html>
  );
}
