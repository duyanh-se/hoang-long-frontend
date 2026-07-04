import type { Metadata } from "next";
import type { ReactNode } from "react";
import logoHoangLong from "@/src/assets/images/Logo_Hoang_Long.jpg";

type ProductSeo = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  imageBase64?: string | null;
  imageMimeType?: string | null;
  brand?: { name: string } | null;
  category?: { name: string } | null;
};

type ProductDetailLayoutProps = {
  children: ReactNode;
  params: Promise<{ id: string }>;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function getProduct(id: string) {
  if (!apiUrl) {
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/products/${id}`, {
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ProductSeo;
  } catch {
    return null;
  }
}

function getProductImage(product: ProductSeo | null) {
  return product?.imageUrl || logoHoangLong.src;
}

export async function generateMetadata({
  params,
}: ProductDetailLayoutProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Chi tiết sản phẩm",
      description:
        "Xem chi tiết phụ tùng xe máy, dầu nhớt và vật tư bảo dưỡng tại Hoàng Long.",
      alternates: {
        canonical: `/products/${id}`,
      },
    };
  }

  const categoryPrefix = product.category?.name
    ? `${product.category.name} - `
    : "";
  const description =
    product.description ??
    `${categoryPrefix}${product.name} tại Hoàng Long. Liên hệ để được tư vấn đúng mã hàng và báo giá nhanh.`;
  const image = getProductImage(product);

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `/products/${product.id}`,
    },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: `/products/${product.id}`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image],
    },
  };
}

export default function ProductDetailLayout({
  children,
}: ProductDetailLayoutProps) {
  return children;
}
