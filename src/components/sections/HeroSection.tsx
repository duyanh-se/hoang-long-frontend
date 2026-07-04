"use client";

import Image, { type StaticImageData } from "next/image";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = heroSlides[activeIndex];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0.2]);
  const slideInfoY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const orbOneY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const orbTwoY = useTransform(scrollYProgress, [0, 1], [0, -180]);

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
    <section
      ref={sectionRef}
      className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-red-950 text-white"
    >
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

      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-red-950/70 via-red-950/35 to-black/5" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle,rgba(255,255,255,0.24) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <motion.div
        style={{ y: orbOneY }}
        className="pointer-events-none absolute -left-16 top-16 h-36 w-36 rounded-full bg-red-400/30 blur-3xl"
      />
      <motion.div
        style={{ y: orbTwoY }}
        className="pointer-events-none absolute -right-12 top-44 h-44 w-44 rounded-full bg-amber-300/25 blur-3xl"
      />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="max-w-4xl rounded-[2rem] border border-white/15 bg-black/25 p-6 pb-32 shadow-2xl shadow-black/15 backdrop-blur-[2px] sm:p-8 lg:pb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-sm backdrop-blur"
          >
            <BadgePercent className="h-4 w-4 shrink-0" />
            Phụ tùng chính hãng cho khách lẻ & gara
          </motion.div>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.75, ease: "easeOut", delay: 0.06 }}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.75rem] border border-white/30 bg-white p-1 shadow-2xl shadow-black/25 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
            >
              <Image
                src={logoHoangLong}
                alt="Logo phụ tùng xe máy Hoàng Long"
                fill
                className="rounded-[1.4rem] object-cover"
                sizes="(min-width: 1024px) 128px, (min-width: 640px) 112px, 96px"
                priority
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.08 }}
              className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl"
            >
              Phụ tùng xe máy chính hãng, có sẵn, giao nhanh.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.16 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-white/80"
          >
            Hoàng Long hỗ trợ chọn đúng dầu nhớt, phụ kiện và linh kiện theo
            dòng xe. Báo giá rõ ràng, tư vấn nhanh và nhận đơn bán lẻ hoặc nhập
            sỉ cho cửa hàng, gara.
          </motion.p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href="#san-pham"
              size="lg"
              className="border-white bg-white text-red-950 shadow-lg shadow-black/20 hover:bg-red-50"
            >
              Xem sản phẩm
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href="#tu-van"
              size="lg"
              className="border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/15"
            >
              Nhận báo giá sỉ
            </ButtonLink>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium text-white/80">
            {[
              "Cam kết chính hãng",
              "500+ mã hàng có sẵn",
              "Báo giá trong 15 phút",
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-300" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        style={{ y: slideInfoY }}
        className="absolute inset-x-4 bottom-6 z-10 mx-auto flex max-w-7xl flex-col gap-4 sm:inset-x-6 lg:inset-x-8 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="max-w-md rounded-3xl border border-white/20 bg-black/25 p-4 text-white shadow-2xl shadow-black/15 backdrop-blur-md">
          <h2 className="text-2xl font-semibold tracking-tight">
            {activeSlide.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/75">
            {activeSlide.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-full border border-white/20 bg-black/20 px-4 py-3 text-white shadow-2xl shadow-black/15 backdrop-blur-md lg:justify-start">
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
      </motion.div>
    </section>
  );
}
