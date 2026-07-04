import type { Metadata } from "next";
import type { ReactNode } from "react";
import logoHoangLong from "@/src/assets/images/Logo_Hoang_Long.jpg";

export const metadata: Metadata = {
  title: "Danh mục phụ tùng xe máy, dầu nhớt chính hãng",
  description:
    "Tìm phụ tùng xe máy, dầu nhớt và vật tư bảo dưỡng chính hãng theo danh mục, thương hiệu và nhóm sản phẩm tại Hoàng Long.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Danh mục phụ tùng xe máy Hoàng Long",
    description:
      "Lọc nhanh phụ tùng, dầu nhớt và vật tư bảo dưỡng chính hãng Honda, Yamaha, Suzuki, SYM.",
    url: "/products",
    images: [
      {
        url: logoHoangLong.src,
        width: 1200,
        height: 630,
        alt: "Danh mục phụ tùng xe máy Hoàng Long",
      },
    ],
  },
};

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return children;
}
