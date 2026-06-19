import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScoreCare Admin",
  description: "ScoreCare admin panel",
  icons: {
    icon: "/scorecare-logo.PNG",
    shortcut: "/scorecare-logo.PNG",
    apple: "/scorecare-logo.PNG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
