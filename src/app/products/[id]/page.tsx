"use client";

import { motion } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  PackageCheck,
  ShoppingCart,
  Tag,
} from "lucide-react";
import logoImg from "@/src/assets/images/Logo_Hoang_Long.jpg";
import { Button, ButtonLink } from "@/src/components/ui/Button";
import {
  fadeUpVariants,
  pageFadeIn,
  scaleInVariants,
  staggerContainerVariants,
  viewportOnce,
} from "@/src/components/ui/motion";
import { trackEvent } from "@/src/lib/tracking";
import { cn, formatVND } from "@/src/lib/utils";
import productService, { type Product } from "@/src/services/product.service";
import { useCartStore } from "@/src/store/useCartStore";

function getProductImageSrc(product: Product): string | StaticImageData {
  const imageUrl = product.imageUrl?.trim();

  if (imageUrl) {
    return imageUrl;
  }

  const imageBase64 = product.imageBase64?.trim();

  if (imageBase64) {
    if (imageBase64.startsWith("data:")) {
      return imageBase64;
    }

    return `data:${product.imageMimeType ?? "image/jpeg"};base64,${imageBase64}`;
  }

  return logoImg;
}

function hasProductImage(product: Product) {
  return Boolean(product.imageUrl?.trim() || product.imageBase64?.trim());
}

function formatSpecValue(value: unknown) {
  if (value == null) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return JSON.stringify(value);
}

export default function ProductDetailPage() {
  const params = useParams<{ id?: string | string[] }>();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedMessage, setAddedMessage] = useState("");

  useEffect(() => {
    if (!productId) {
      return;
    }

    const currentProductId = productId;

    async function loadProduct() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await productService.getProductById(currentProductId);
        setProduct(response);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải chi tiết sản phẩm",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  const imageSrc = useMemo(() => {
    return product ? getProductImageSrc(product) : logoImg;
  }, [product]);

  const specEntries = useMemo(() => {
    if (!product?.specs) {
      return [];
    }

    return Object.entries(product.specs)
      .map(([key, value]) => [key, formatSpecValue(value)] as const)
      .filter(([, value]) => Boolean(value));
  }, [product]);

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price ?? 0,
      quantity: 1,
      imageUrl: typeof imageSrc === "string" ? imageSrc : undefined,
    });
    trackEvent("ADD_TO_CART", {
      productId: product.id,
      productName: product.name,
      price: product.price ?? null,
    });

    setAddedMessage("Đã thêm sản phẩm vào giỏ hàng.");
    window.setTimeout(() => setAddedMessage(""), 2200);
  };

  if (!productId) {
    return (
      <motion.div
        {...pageFadeIn}
        className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleInVariants}
          className="max-w-lg rounded-4xl border border-red-200 bg-white/90 p-8 text-center shadow-lg shadow-red-950/5 dark:border-red-800 dark:bg-red-950/70"
        >
          <p className="text-lg font-semibold text-red-700 dark:text-red-200">
            Không tìm thấy mã sản phẩm.
          </p>
          <Link
            href="/products"
            className="mt-5 inline-flex rounded-full border border-red-200 bg-red-50 px-5 py-2 text-sm font-semibold text-red-900 hover:bg-red-100 dark:border-red-700 dark:bg-red-950 dark:text-red-100"
          >
            Quay lại sản phẩm
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        {...pageFadeIn}
        className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleInVariants}
          className="rounded-4xl border border-red-100 bg-white/90 p-8 text-center text-zinc-700 shadow-lg shadow-red-950/5 dark:border-red-800 dark:bg-red-950/70 dark:text-zinc-200"
        >
          Đang tải chi tiết sản phẩm...
        </motion.div>
      </motion.div>
    );
  }

  if (error || !product) {
    return (
      <motion.div
        {...pageFadeIn}
        className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleInVariants}
          className="max-w-lg rounded-4xl border border-red-200 bg-white/90 p-8 text-center shadow-lg shadow-red-950/5 dark:border-red-800 dark:bg-red-950/70"
        >
          <p className="text-lg font-semibold text-red-700 dark:text-red-200">
            {error ?? "Không tìm thấy sản phẩm"}
          </p>
          <Link
            href="/products"
            className="mt-5 inline-flex rounded-full border border-red-200 bg-red-50 px-5 py-2 text-sm font-semibold text-red-900 hover:bg-red-100 dark:border-red-700 dark:bg-red-950 dark:text-red-100"
          >
            Quay lại sản phẩm
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  const categoryName = product.category?.name;
  const brandName = product.brand?.name;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hoanglong.vn";
  const productUrl = `${siteUrl}/products/${product.id}`;
  const productImageForSeo =
    typeof imageSrc === "string" && imageSrc.startsWith("http")
      ? imageSrc
      : typeof imageSrc === "string" && imageSrc.startsWith("/")
        ? `${siteUrl}${imageSrc}`
        : `${siteUrl}${typeof imageSrc === "string" ? logoImg.src : imageSrc.src}`;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ??
      "Phụ tùng xe máy, dầu nhớt và vật tư bảo dưỡng tại Hoàng Long.",
    image: productImageForSeo,
    url: productUrl,
    brand: brandName
      ? {
          "@type": "Brand",
          name: brandName,
        }
      : undefined,
    category: categoryName,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "VND",
      price: product.price ?? undefined,
      availability: product.isActive
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <motion.div
      {...pageFadeIn}
      className="min-h-screen bg-[linear-gradient(180deg,rgba(251,191,36,0.14),rgba(255,255,255,0))] text-foreground"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
      >
        <motion.div variants={fadeUpVariants}>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/80 px-4 py-2 text-sm font-semibold text-red-800 shadow-sm hover:bg-red-50 dark:border-red-800 dark:bg-red-950/70 dark:text-red-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>
        </motion.div>

        <motion.div
          variants={scaleInVariants}
          className="mt-5 grid gap-6 rounded-3xl border border-red-100 bg-white/90 p-4 shadow-[0_24px_80px_rgba(127,29,29,0.08)] backdrop-blur dark:border-red-800 dark:bg-red-950/70 sm:mt-6 sm:rounded-4xl sm:p-5 lg:grid-cols-[1fr_0.95fr] lg:gap-8 lg:p-8"
        >
          <motion.div
            variants={fadeUpVariants}
            className="relative aspect-square overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.95),rgba(254,226,226,0.92),rgba(248,113,113,0.22))] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(127,29,29,0.5),rgba(69,10,10,0.85),rgba(20,8,8,1))] sm:rounded-4xl"
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Image
              src={imageSrc}
              alt={`Hình ảnh ${product.name}`}
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className={cn(
                "transition-transform duration-500 hover:scale-105",
                hasProductImage(product)
                  ? "object-cover"
                  : "object-contain p-10 opacity-90",
              )}
              unoptimized={
                typeof imageSrc === "string" && imageSrc.startsWith("data:")
              }
            />
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col justify-center"
          >
            <div className="flex flex-wrap gap-2">
              {brandName ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/50 dark:text-red-100">
                  <PackageCheck className="h-3.5 w-3.5" />
                  {brandName}
                </span>
              ) : null}
              {categoryName ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-100">
                  <Tag className="h-3.5 w-3.5" />
                  {categoryName}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {product.isActive ? "Đang kinh doanh" : "Tạm hết"}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:mt-5 sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base sm:leading-8">
              {product.description ??
                "Liên hệ Hoàng Long để được tư vấn cấu hình và báo giá phù hợp."}
            </p>

            <div className="mt-5 rounded-3xl border border-red-100 bg-red-50/80 p-4 dark:border-red-800 dark:bg-red-950/50 sm:mt-6 sm:rounded-4xl sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-500 dark:text-red-300">
                Giá bán
              </p>
              <p className="mt-2 text-2xl font-bold text-red-700 dark:text-red-200 sm:text-3xl">
                {product.price != null
                  ? formatVND(product.price)
                  : "Liên hệ để biết giá"}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.isActive}
                className="h-12 w-full border-red-600 bg-red-600 text-white hover:bg-red-700 dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-400"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Thêm vào giỏ hàng
              </Button>
              <ButtonLink
                href="/#tu-van"
                variant="neutral"
                className="h-12 w-full"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Liên hệ tư vấn
              </ButtonLink>
            </div>

            {addedMessage ? (
              <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                {addedMessage}
              </p>
            ) : null}

            {product.tags?.length ? (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={staggerContainerVariants}
                className="mt-6 flex flex-wrap gap-2"
              >
                {product.tags.map((tagItem) => (
                  <motion.span
                    key={tagItem.id}
                    variants={scaleInVariants}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-white/10 dark:text-zinc-200"
                  >
                    #{tagItem.name}
                  </motion.span>
                ))}
              </motion.div>
            ) : null}
          </motion.div>
        </motion.div>

        {specEntries.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUpVariants}
            className="mt-6 rounded-3xl border border-red-100 bg-white/90 p-5 shadow-lg shadow-red-950/5 dark:border-red-800 dark:bg-red-950/60 sm:mt-8 sm:rounded-4xl sm:p-8"
          >
            <h2 className="text-xl font-semibold text-zinc-950 dark:text-white sm:text-2xl">
              Thông số sản phẩm
            </h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainerVariants}
              className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {specEntries.map(([key, value]) => (
                <motion.div
                  key={key}
                  variants={scaleInVariants}
                  className="rounded-3xl border border-red-100 bg-red-50/70 p-4 dark:border-red-800 dark:bg-red-950/40"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-500 dark:text-red-300">
                    {key}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                    {value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : null}
      </motion.section>
    </motion.div>
  );
}
