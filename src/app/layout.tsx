import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Zen_Kaku_Gothic_Antique, Shippori_Mincho } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans",
});

const zenKaku = Zen_Kaku_Gothic_Antique({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-zen-kaku",
});

const shipporiMincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-shippori",
});

export const metadata: Metadata = {
  title: "和利缶（ワリカン） - かんたん割り勘計算",
  description:
    "旅行やグループイベントにおける割り勘計算をシンプルに解決する無料のWebサービス。会員登録不要・アプリインストール不要で即座に利用できます。",
  keywords: ["割り勘", "ワリカン", "旅行", "グループ", "精算", "立て替え"],
  openGraph: {
    title: "和利缶（ワリカン） - かんたん割り勘計算",
    description:
      "旅行やグループイベントにおける割り勘計算をシンプルに解決する無料のWebサービス",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ワリカン",
  },
};

export const viewport: Viewport = {
  themeColor: "#6EB92B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${notoSansJP.variable} ${zenKaku.variable} ${shipporiMincho.variable} antialiased`}>
        <Providers>{children}</Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
