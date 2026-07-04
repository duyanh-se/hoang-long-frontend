import type { MetadataRoute } from "next";

type ProductSitemapItem = {
  id: string;
  updatedAt?: string;
};

type ProductSitemapResponse = {
  items?: ProductSitemapItem[];
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hoanglong.vn";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function getProductEntries(): Promise<MetadataRoute.Sitemap> {
  if (!apiUrl) {
    return [];
  }

  try {
    const response = await fetch(`${apiUrl}/products?limit=100`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as ProductSitemapResponse;

    return (data.items ?? []).map((product) => ({
      url: `${siteUrl}/products/${product.id}`,
      lastModified: product.updatedAt
        ? new Date(product.updatedAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...(await getProductEntries()),
  ];
}
