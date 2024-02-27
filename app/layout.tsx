import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZSZIOK Rekolekcje 2024",
  description: "Weryfikator obecności na rekolekcjach",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
