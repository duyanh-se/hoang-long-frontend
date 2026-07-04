"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import storeImageOne from "@/src/assets/images/cua-hang-1.jpg";
import storeImageTwo from "@/src/assets/images/cua-hang-2.jpg";
import storeImageThree from "@/src/assets/images/cua-hang-3.jpg";
import storeImageFour from "@/src/assets/images/cua-hang-4.jpg";
import storeImageFive from "@/src/assets/images/cua-hang-5.jpg";
import storeImageSix from "@/src/assets/images/cua-hang-6.jpg";

type StoreImage = {
  src: StaticImageData;
  title: string;
  description: string;
};

const storeImages: StoreImage[] = [
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
  return (index + storeImages.length) % storeImages.length;
}

export default function StoreGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  const image = storeImages[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((current) => getCircularIndex(current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => getCircularIndex(current + 1));
  };

  return (
    <div className="rounded-4xl border border-red-100 bg-white/80 p-0 shadow-lg shadow-red-950/5 backdrop-blur dark:border-red-800 dark:bg-red-950/50 sm:p-0">
      <div className="relative overflow-hidden rounded-4xl border border-red-100 bg-red-50/70 shadow-sm dark:border-red-800 dark:bg-red-950/60">
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9]">
          <Image
            src={image.src}
            alt={image.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-4 text-white sm:px-6 sm:pb-6">
            <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {image.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              {image.description}
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 sm:px-4">
          <button
            type="button"
            onClick={goToPrevious}
            className="pointer-events-auto rounded-full border border-white/20 bg-black/30 p-2.5 text-white transition hover:bg-black/50 sm:p-3"
            aria-label="Xem ảnh trước đó"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 sm:px-4">
          <button
            type="button"
            onClick={goToNext}
            className="pointer-events-auto rounded-full border border-white/20 bg-black/30 p-2.5 text-white transition hover:bg-black/50 sm:p-3"
            aria-label="Xem ảnh tiếp theo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 px-4 py-4">
        {storeImages.map((imageOption, index) => (
          <button
            key={imageOption.title}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-8 bg-red-600 dark:bg-red-400"
                : "w-2.5 bg-red-200 hover:bg-red-300 dark:bg-red-900 dark:hover:bg-red-700"
            }`}
            aria-label={`Xem ảnh ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
