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
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-zinc-950 dark:text-white sm:min-h-12 sm:text-base sm:leading-6">
          {product.name}
        </h3>
        <p className="flex min-h-10 w-full items-center justify-center rounded-2xl border border-red-100 bg-red-50/80 px-2 py-2 text-sm font-bold text-red-700 shadow-sm dark:border-red-800 dark:bg-red-950/70 dark:text-red-200 sm:min-h-11 sm:px-3 sm:text-lg">
          {product.price != null
            ? formatVND(product.price)
            : "Liên hệ để biết giá"}
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
