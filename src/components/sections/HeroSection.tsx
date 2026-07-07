"use client";

import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import storeImageOne from "@/src/assets/images/cua-hang-1.jpg";
import storeImageTwo from "@/src/assets/images/cua-hang-2.jpg";
import storeImageThree from "@/src/assets/images/cua-hang-3.jpg";
import storeImageFour from "@/src/assets/images/cua-hang-4.jpg";
import storeImageFive from "@/src/assets/images/cua-hang-5.jpg";
import storeImageSix from "@/src/assets/images/cua-hang-6.jpg";
import logoHoangLong from "@/src/assets/images/Logo_Hoang_Long.jpg";
import { Button, ButtonLink } from "../ui/Button";

type HeroSlide = {
  src: StaticImageData;
  title: string;
  description: string;
};

const heroSlides: HeroSlide[] = [
  {
    src: storeImageOne,
    title: "Khu vực trưng bày",
    description: "Phụ tùng, dầu nhớt và vật tư bảo dưỡng được sắp xếp dễ tìm.",
  },
  {
    src: storeImageTwo,
    title: "Quầy tư vấn",
    description: "Hỗ trợ chọn đúng mã hàng theo dòng xe và nhu cầu sử dụng.",
  },
  {
    src: storeImageThree,
    title: "Nguồn hàng có sẵn",
    description: "Nhiều mã phụ tùng thông dụng phục vụ bán lẻ và gara.",
  },
  {
    src: storeImageFour,
    title: "Dầu nhớt chính hãng",
    description: "Các dòng nhớt phổ biến cho xe ga, xe số và xe côn tay.",
  },
  {
    src: storeImageFive,
    title: "Đóng gói đơn hàng",
    description: "Kiểm tra sản phẩm trước khi giao hoặc gửi cho khách.",
  },
  {
    src: storeImageSix,
    title: "Không gian cửa hàng",
    description: "Sạch sẽ, rõ khu vực để khách dễ tham khảo sản phẩm.",
  },
];

function getCircularIndex(index: number) {
  return (index + heroSlides.length) % heroSlides.length;
}

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = heroSlides[activeIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => getCircularIndex(current + 1));
    }, 6500);

    return () => window.clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setActiveIndex((current) => getCircularIndex(current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => getCircularIndex(current + 1));
  };

  return (
    <section className="relative isolate min-h-180 overflow-hidden bg-red-950 text-white sm:min-h-[calc(100vh-5rem)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.title}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-0 -z-30"
        >
          <Image
            src={activeSlide.src}
            alt={activeSlide.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 -z-20 bg-linear-to-r from-red-950/75 via-red-950/40 to-black/10" />
      <div className="absolute inset-0 -z-20 bg-linear-to-t from-black/45 via-transparent to-black/10" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle,rgba(255,255,255,0.24) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="pointer-events-none absolute -left-16 top-16 h-36 w-36 rounded-full bg-red-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-44 h-44 w-44 rounded-full bg-amber-300/25 blur-3xl" />

      <div className="mx-auto flex min-h-180 w-full max-w-7xl items-start px-4 pb-56 pt-16 sm:min-h-[calc(100vh-5rem)] sm:items-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <motion.div className="max-w-3xl rounded-[1.75rem] border border-white/15 bg-black/30 p-5 shadow-2xl shadow-black/15 backdrop-blur-[2px] sm:rounded-4xl sm:p-8 lg:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur sm:px-4 sm:text-xs sm:tracking-[0.24em]"
          >
            <BadgePercent className="h-4 w-4 shrink-0" />
            Hoàng Long Motorbike Parts
          </motion.div>

          <div className="mt-5 flex flex-col gap-4 sm:mt-6 sm:flex-row sm:items-center sm:gap-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.75, ease: "easeOut", delay: 0.06 }}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl border border-white/30 bg-white p-1 shadow-2xl shadow-black/25 sm:h-28 sm:w-28 sm:rounded-[1.75rem] lg:h-32 lg:w-32"
            >
              <Image
                src={logoHoangLong}
                alt="Logo phụ tùng xe máy Hoàng Long"
                fill
                className="rounded-[1.2rem] object-cover sm:rounded-[1.4rem]"
                sizes="(min-width: 1024px) 128px, (min-width: 640px) 112px, 80px"
                priority
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.08 }}
              className="max-w-4xl text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl"
            >
              Tìm đúng phụ tùng xe máy nhanh hơn.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.16 }}
            className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:mt-6 sm:text-lg sm:leading-8"
          >
            Chọn phụ tùng, dầu nhớt và vật tư bảo dưỡng theo nhu cầu thực tế.
            Nếu chưa chắc mã hàng, gửi dòng xe để được tư vấn và báo giá nhanh.
          </motion.p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <ButtonLink
              href="/products"
              size="lg"
              className="w-full border-white bg-white text-red-950 shadow-lg shadow-black/20 hover:bg-red-50 sm:w-auto"
            >
              Tìm sản phẩm
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href="#tu-van"
              size="lg"
              className="w-full border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/15 sm:w-auto"
            >
              Gửi yêu cầu tư vấn
            </ButtonLink>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-x-4 bottom-5 z-10 mx-auto flex max-w-7xl flex-col gap-3 sm:inset-x-6 sm:bottom-6 sm:gap-4 lg:inset-x-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="hidden max-w-md rounded-3xl border border-white/20 bg-black/30 p-4 text-white shadow-2xl shadow-black/15 backdrop-blur-md sm:block">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {activeSlide.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/75">
            {activeSlide.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-full border border-white/20 bg-black/25 px-3 py-2.5 text-white shadow-2xl shadow-black/15 backdrop-blur-md sm:gap-4 sm:px-4 sm:py-3 lg:justify-start">
          <Button
            variant="overlay"
            size="iconSm"
            onClick={goToPrevious}
            className="border border-white/20 bg-white/10 text-white hover:bg-white/20"
            aria-label="Xem ảnh trước đó"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            {heroSlides.map((slide, index) => (
              <button
                suppressHydrationWarning
                key={slide.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-white"
                    : "w-2.5 bg-white/35 hover:bg-white/60"
                }`}
                aria-label={`Xem ảnh ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>

          <Button
            variant="overlay"
            size="iconSm"
            onClick={goToNext}
            className="border border-white/20 bg-white/10 text-white hover:bg-white/20"
            aria-label="Xem ảnh tiếp theo"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
