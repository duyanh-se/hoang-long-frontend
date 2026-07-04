import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import logoHoangLong from "@/src/assets/images/Logo_Hoang_Long.jpg";
import BehaviorTracker from "../components/layout/BehaviorTracker";
import Header from "../components/layout/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hoanglong.vn";
const defaultOgImage = logoHoangLong.src;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Phụ tùng xe máy Hoàng Long | Phụ tùng, dầu nhớt chính hãng",
    template: "%s | Phụ tùng xe máy Hoàng Long",
  },
  description:
    "Hoàng Long cung cấp phụ tùng xe máy, dầu nhớt và vật tư bảo dưỡng chính hãng Honda, Yamaha, Suzuki, SYM. Hỗ trợ khách lẻ, cửa hàng và gara.",
  keywords: [
    "phụ tùng xe máy Hoàng Long",
    "phụ tùng xe máy chính hãng",
    "dầu nhớt xe máy",
    "phụ tùng Honda",
    "phụ tùng Yamaha",
    "phụ tùng Suzuki",
    "phụ tùng SYM",
    "phụ tùng xe máy Biên Hòa",
  ],
  applicationName: "Hoàng Long Motorbike Parts",
  authors: [{ name: "Phụ tùng xe máy Hoàng Long" }],
  creator: "Phụ tùng xe máy Hoàng Long",
  publisher: "Phụ tùng xe máy Hoàng Long",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: "Phụ tùng xe máy Hoàng Long",
    title: "Phụ tùng xe máy Hoàng Long | Phụ tùng, dầu nhớt chính hãng",
    description:
      "Cửa hàng phụ tùng xe máy, dầu nhớt và vật tư bảo dưỡng chính hãng cho khách lẻ, cửa hàng và gara.",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Phụ tùng xe máy Hoàng Long",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phụ tùng xe máy Hoàng Long",
    description:
      "Phụ tùng xe máy, dầu nhớt và vật tư bảo dưỡng chính hãng Honda, Yamaha, Suzuki, SYM.",
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoPartsStore",
  name: "Phụ tùng xe máy Hoàng Long",
  description:
    "Cửa hàng phụ tùng xe máy, dầu nhớt và vật tư bảo dưỡng chính hãng Honda, Yamaha, Suzuki, SYM.",
  telephone: "+84945523790",
  url: siteUrl,
  image: `${siteUrl}${defaultOgImage}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "320A Bùi Trọng Nghĩa, khu phố 2A, phường Trảng Dài",
    addressLocality: "Biên Hòa",
    addressRegion: "Đồng Nai",
    addressCountry: "VN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 10.9776302,
    longitude: 106.8548304,
  },
  sameAs: ["https://www.facebook.com/baolong.talam/about?locale=vi_VN"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        <BehaviorTracker />
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
