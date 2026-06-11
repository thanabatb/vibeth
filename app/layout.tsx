import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeTH — สิ่งที่คนไทยสร้างด้วย AI",
  description: "พอร์ตโฟลิโอสำหรับ vibe coders ไทย · claim โปรเจกต์ของคุณ · แชร์ผลงาน",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://vibeth.app"),
  openGraph: {
    siteName: "VibeTH",
    locale: "th_TH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
