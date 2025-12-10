import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Operation MCP - Webrix",
  description: "Can you hack the AI? An interactive demo showcasing the importance of AI agent security.",
  keywords: ["AI security", "MCP", "prompt injection", "Webrix", "AI governance"],
  authors: [{ name: "Webrix" }],
  openGraph: {
    title: "Operation MCP - Can You Hack The AI?",
    description: "An interactive booth demo for AI Dev TLV. Try to hack DevBot and see how Webrix protects against AI agent attacks.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
