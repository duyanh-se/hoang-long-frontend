"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Droplets,
  MessageCircle,
  PackageCheck,
  PhoneCall,
  ShoppingBag,
  Star,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import logoCuaHang from "@/src/assets/images/logo-cua-hang.jpg";
import QuickActions from "../components/layout/QuickActions";
import HeroSection from "../components/sections/HeroSection";
import { ButtonLink } from "../components/ui/Button";
import { InfoCard } from "../components/ui/InfoCard";
import {
  fadeUpVariants,
  pageFadeIn,
  scaleInVariants,
  staggerContainerVariants,
  viewportOnce,
} from "../components/ui/motion";
import { ProductCard } from "../components/ui/ProductCard";
import productService, { FeaturedProduct } from "../services/product.service";

const trustItems = [
  {
    label: "Mã hàng",
    value: "500+",
    description: "Phụ tùng, dầu nhớt, phụ kiện",
  },
  { label: "Giao hàng", value: "2h", description: "Nội thành cho đơn cần gấp" },
  {
    label: "Báo giá",
    value: "15 phút",
    description: "Hỗ trợ bán lẻ và nhập sỉ",
  },
];

const quickCategories = [
  {
    title: "Dầu nhớt",
    description: "Các dòng nhớt phổ biến cho xe ga, xe số và xe côn tay.",
    icon: Droplets,
  },
  {
    title: "Phụ tùng thay thế",
    description: "Bugi, lọc gió, bố thắng và các mã phụ tùng thông dụng.",
    icon: Wrench,
  },
  {
    title: "Phụ kiện",
    description: "Phụ kiện bảo dưỡng, nâng cấp và chăm sóc xe máy.",
    icon: ShoppingBag,
  },
  {
    title: "Đơn sỉ cho gara",
    description: "Hỗ trợ báo giá nhanh cho cửa hàng và gara cần nhập hàng.",
    icon: PackageCheck,
  },
];

const customerProof = [
  {
    quote:
      "Tư vấn đúng mã phụ tùng, báo giá nhanh nên cửa hàng dễ chốt đơn hơn.",
    name: "Anh Minh",
    role: "Chủ tiệm sửa xe",
  },
  {
    quote:
      "Sản phẩm được đóng gói kỹ, giao nhanh và dễ kiểm tra trước khi nhận.",
    name: "Chị Hương",
    role: "Khách mua lẻ",
  },
  {
    quote: "Có nhiều mã hàng thông dụng, phù hợp nhập định kỳ cho gara nhỏ.",
    name: "Gara Tân Phát",
    role: "Khách nhập sỉ",
  },
];

const featuredProductsLimit = 8;

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeaturedProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await productService.getFeaturedProducts({
          limit: featuredProductsLimit,
        });
        setFeaturedProducts(response.items ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Lỗi khi tải sản phẩm nổi bật",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadFeaturedProducts();
  }, []);

  return (
    <motion.div
      id="top"
      {...pageFadeIn}
      className="flex flex-col text-foreground"
      style={{
        backgroundImage:
          "linear-gradient(180deg,rgba(251,191,36,0.12),rgba(255,255,255,0))",
      }}
    >
      <QuickActions />
      <HeroSection />

      <motion.section
        id="gioi-thieu"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUpVariants}
        className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
      >
        <motion.div
          variants={scaleInVariants}
          className="overflow-hidden rounded-[2rem] border border-red-100 bg-white/85 shadow-xl shadow-red-950/5 backdrop-blur dark:border-red-800 dark:bg-red-950/45"
        >
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <div className="relative min-h-[240px] border-b border-red-100 bg-red-50/70 dark:border-red-800 dark:bg-red-950/60 sm:min-h-[320px] lg:min-h-full lg:border-b-0 lg:border-r">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100/70 via-transparent to-amber-100/40 dark:from-red-900/30 dark:to-red-950/20" />
              <div className="relative flex h-full items-center justify-center p-4 sm:p-8">
                <div className="relative aspect-[4/3] w-full max-w-lg overflow-hidden rounded-[1.5rem] border border-red-100 bg-white shadow-2xl shadow-red-950/10 dark:border-red-800 dark:bg-red-950/60 sm:rounded-[1.75rem]">
                  <Image
                    src={logoCuaHang}
                    alt="Hình ảnh logo cửa hàng phụ tùng xe máy Hoàng Long"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 44vw, 100vw"
                    priority={false}
                  />
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400 sm:text-sm sm:tracking-[0.24em]">
                Giới thiệu
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:mt-4 sm:text-4xl">
                Cửa hàng phụ tùng xe máy, dầu nhớt và vật tư bảo dưỡng chính
                hãng.
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-700 dark:text-zinc-300 sm:mt-5 sm:text-lg sm:leading-8">
                Hoàng Long cung cấp phụ tùng, dầu nhớt và phụ kiện bảo dưỡng cho
                khách lẻ, gara và cửa hàng. Sản phẩm được trình bày rõ ảnh, giá
                và thông tin tư vấn để khách dễ chọn đúng mã hàng.
              </p>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={staggerContainerVariants}
                className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3"
              >
                {trustItems.map((item) => (
                  <motion.div
                    key={item.label}
                    variants={scaleInVariants}
                    className="rounded-3xl border border-red-100 bg-red-50/80 p-3 shadow-sm dark:border-red-800 dark:bg-red-950/70 sm:p-4"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-500 dark:text-red-300 sm:text-xs sm:tracking-[0.2em]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xl font-bold text-red-800 dark:text-red-100 sm:text-2xl">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={staggerContainerVariants}
                className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2"
              >
                {[
                  "Tư vấn đúng mã phụ tùng theo dòng xe",
                  "Phù hợp bán lẻ, gara và cửa hàng nhập sỉ",
                ].map((item) => (
                  <motion.div
                    key={item}
                    variants={fadeUpVariants}
                    className="flex items-start gap-3 rounded-3xl bg-white/70 p-4 text-sm font-medium text-zinc-700 shadow-sm dark:bg-red-950/70 dark:text-zinc-200"
                  >
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-300" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        id="san-pham"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUpVariants}
        className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400 sm:text-sm sm:tracking-[0.24em]">
              Sản phẩm
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:mt-4 sm:text-4xl">
              Sản phẩm nổi bật, dễ chọn và dễ đặt hàng.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base sm:leading-7">
            Chọn nhanh nhóm hàng phù hợp hoặc xem trực tiếp các sản phẩm đang
            được nhiều khách quan tâm.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainerVariants}
          className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4"
        >
          {quickCategories.map(({ title, description, icon: CategoryIcon }) => (
            <motion.div
              key={title}
              variants={scaleInVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <Link
                href="/products"
                className="group block h-full rounded-3xl border border-red-100 bg-white/90 p-4 shadow-sm transition-all duration-300 hover:border-red-200 hover:shadow-xl hover:shadow-red-950/10 dark:border-red-800 dark:bg-red-950/60 dark:hover:border-red-600 sm:rounded-4xl sm:p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-950/15 transition group-hover:scale-105 dark:bg-red-500">
                  <CategoryIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-zinc-950 dark:text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUpVariants}
          className="mt-5 rounded-3xl border border-red-100 bg-white/80 p-4 shadow-sm dark:border-red-800 dark:bg-red-950/50 sm:mt-6 sm:rounded-4xl sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-500 dark:text-red-300">
                Sản phẩm nổi bật
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                {isLoading
                  ? "Đang tải sản phẩm nổi bật..."
                  : `Xem thêm tại trang sản phẩm.`}
              </p>
            </div>

            <ButtonLink
              href="/products"
              className="w-full border-red-600 bg-red-600 text-white shadow-lg shadow-red-950/15 hover:bg-red-700 dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-400 sm:w-auto"
            >
              Xem tất cả sản phẩm
            </ButtonLink>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainerVariants}
          className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 xl:grid-cols-4"
        >
          {isLoading ? (
            <div className="col-span-full rounded-3xl border border-red-100 bg-red-50/90 p-6 text-center text-zinc-700 shadow-lg shadow-red-950/5 dark:border-red-700 dark:bg-red-950/70 dark:text-zinc-200 sm:rounded-4xl sm:p-8">
              Đang tải sản phẩm...
            </div>
          ) : error ? (
            <div className="col-span-full rounded-3xl border border-red-200 bg-red-50/90 p-6 text-center text-red-700 shadow-lg shadow-red-950/5 dark:border-red-700 dark:bg-red-950/70 dark:text-red-300 sm:rounded-4xl sm:p-8">
              {error}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-red-100 bg-red-50/90 p-6 text-center text-zinc-700 shadow-lg shadow-red-950/5 dark:border-red-700 dark:bg-red-950/70 dark:text-zinc-200 sm:rounded-4xl sm:p-8">
              Chưa có sản phẩm nổi bật để hiển thị.
            </div>
          ) : (
            featuredProducts.map((featuredProduct) => {
              const product = featuredProduct.product;

              return (
                <ProductCard
                  key={featuredProduct.id}
                  product={{
                    ...product,
                    name: featuredProduct.titleOverride ?? product.name,
                    description:
                      featuredProduct.descriptionOverride ??
                      product.description,
                  }}
                />
              );
            })
          )}
        </motion.div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUpVariants}
        className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400 sm:text-sm sm:tracking-[0.24em]">
              Khách hàng tin chọn
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight sm:mt-4 sm:text-4xl">
              Phù hợp cho khách lẻ, thợ sửa xe và gara cần nguồn hàng ổn định.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base sm:leading-7">
            Tập trung vào tư vấn đúng mã hàng, giá rõ ràng và hỗ trợ đặt hàng
            nhanh để khách dễ quyết định.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainerVariants}
          className="mt-6 grid gap-4 sm:mt-8 md:grid-cols-3 md:gap-5"
        >
          {customerProof.map((item) => (
            <motion.article
              key={item.name}
              variants={scaleInVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="rounded-3xl border border-red-100 bg-white/90 p-5 shadow-lg shadow-red-950/5 dark:border-red-800 dark:bg-red-950/60 sm:rounded-4xl sm:p-6"
            >
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                “{item.quote}”
              </p>
              <div className="mt-6 border-t border-red-100 pt-4 dark:border-red-800">
                <p className="font-semibold text-zinc-950 dark:text-white">
                  {item.name}
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {item.role}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        id="tu-van"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUpVariants}
        className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
      >
        <motion.div
          variants={scaleInVariants}
          className="rounded-3xl border border-red-700 bg-red-950 p-5 text-white shadow-[0_30px_80px_rgba(146,21,21,0.22)] sm:rounded-4xl sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300 sm:text-sm sm:tracking-[0.24em]">
                Tư vấn
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:mt-4 sm:text-4xl">
                Gửi dòng xe, nhận đúng mã phụ tùng và báo giá nhanh.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
                Gửi nhu cầu sản phẩm, dòng xe hoặc số lượng cần nhập. Hoàng Long
                hỗ trợ kiểm tra mã hàng, báo giá bán lẻ/bán sỉ và hướng dẫn chốt
                đơn nhanh cho khách lẻ, cửa hàng hoặc gara.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="mailto:info@hoanglong.vn"
                  variant="inverse"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Nhận báo giá ngay
                </ButtonLink>
                <ButtonLink
                  href="tel:0945523790"
                  size="lg"
                  className="w-full border-white/20 bg-white/10 text-white hover:bg-white/15 sm:w-auto"
                >
                  <PhoneCall className="mr-2 h-4 w-4" />
                  Gọi 0945 523 790
                </ButtonLink>
              </div>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainerVariants}
              className="grid gap-4 sm:grid-cols-2"
            >
              {[
                ["Hotline", "0945 523 790"],
                ["Phản hồi", "Trong 15 phút"],
                ["Báo giá", "Bán lẻ & bán sỉ"],
                ["Giao hàng", "Nội thành nhanh"],
              ].map(([label, value]) => (
                <motion.div key={label} variants={scaleInVariants}>
                  <InfoCard variant="dark" size="md">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                      {label}
                    </p>
                    <p className="mt-3 text-base font-medium text-white">
                      {value}
                    </p>
                  </InfoCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
