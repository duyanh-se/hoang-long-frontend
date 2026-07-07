"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import logoImg from "@/src/assets/images/Logo_Hoang_Long.jpg";
import { cn, formatVND } from "@/src/lib/utils";
import type { Product } from "@/src/services/product.service";
import { ButtonLink } from "./Button";
import { fadeUpVariants, viewportOnce } from "./motion";

export type ProductCardProps = HTMLMotionProps<"article"> & {
  product: Product;
};

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

export function ProductCard({
  product,
  className,
  tabIndex,
  ...props
}: ProductCardProps) {
  const imageSrc = getProductImageSrc(product);
  const hasImage = hasProductImage(product);
  const categoryName = product.category?.name;
  const brandName = product.brand?.name;
  const displayPrice = product.price != null ? formatVND(product.price) : null;

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUpVariants}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-4xl border border-red-100 bg-white shadow-[0_16px_45px_rgba(127,29,29,0.07)] transition-colors duration-300 hover:border-red-200 hover:shadow-[0_24px_70px_rgba(185,28,28,0.16)] focus-within:border-red-200 focus-within:shadow-[0_24px_70px_rgba(185,28,28,0.16)] dark:border-red-800 dark:bg-red-950/80 dark:hover:border-red-600 dark:focus-within:border-red-600",
        className,
      )}
      tabIndex={tabIndex ?? 0}
      {...props}
    >
      <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.95),rgba(254,226,226,0.92),rgba(248,113,113,0.22))] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(127,29,29,0.5),rgba(69,10,10,0.85),rgba(20,8,8,1))]">
        <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] sm:text-xs">
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 shadow-sm backdrop-blur",
              product.isActive
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200"
                : "border-amber-200 bg-amber-50/95 text-amber-700 dark:border-amber-800 dark:bg-amber-950/80 dark:text-amber-200",
            )}
          >
            {product.isActive ? "Sẵn hàng" : "Tạm hết"}
          </span>
          {brandName ? (
            <span className="max-w-28 truncate rounded-full border border-white/80 bg-white/90 px-2.5 py-1 text-red-700 shadow-sm backdrop-blur dark:border-red-800 dark:bg-red-950/80 dark:text-red-100 sm:max-w-36">
              {brandName}
            </span>
          ) : null}
        </div>
        <Image
          src={imageSrc}
          alt={`Hình ảnh ${product.name}`}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className={cn(
            "transition-transform duration-300 group-hover:scale-105",
            hasImage ? "object-cover" : "object-contain p-6 opacity-90",
          )}
          unoptimized={
            typeof imageSrc === "string" && imageSrc.startsWith("data:")
          }
        />
      </div>

      <div className="flex flex-1 flex-col items-center gap-2 p-3 text-center sm:p-4">
        {categoryName ? (
          <p className="max-w-full truncate rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-semibold text-zinc-600 dark:bg-white/10 dark:text-zinc-200 sm:text-xs">
            {categoryName}
          </p>
        ) : null}
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-zinc-950 dark:text-white sm:min-h-12 sm:text-base sm:leading-6">
          {product.name}
        </h3>
        {product.description ? (
          <p className="hidden min-h-10 text-xs leading-5 text-zinc-500 dark:text-zinc-300 sm:line-clamp-2">
            {product.description}
          </p>
        ) : null}
        <p
          className={cn(
            "flex min-h-10 w-full items-center justify-center rounded-2xl border px-2 py-2 text-sm font-bold shadow-sm sm:min-h-11 sm:px-3 sm:text-lg",
            displayPrice
              ? "border-red-100 bg-red-50/80 text-red-700 dark:border-red-800 dark:bg-red-950/70 dark:text-red-200"
              : "border-amber-100 bg-amber-50/90 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200",
          )}
        >
          {displayPrice ?? "Liên hệ giá"}
        </p>
        <ButtonLink
          href={`/products/${product.id}`}
          variant="ghost"
          size="overlay"
          className="mt-1 flex h-10 w-full items-center justify-center rounded-2xl border border-red-600 bg-red-600 px-3 text-xs text-white shadow-lg shadow-red-950/15 hover:bg-red-700 dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-400 sm:h-11 sm:px-5 sm:text-sm"
          aria-label={`Xem chi tiết ${product.name}`}
        >
          Xem chi tiết
        </ButtonLink>
      </div>
    </motion.article>
  );
}
