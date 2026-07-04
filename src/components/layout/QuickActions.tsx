"use client";

import { motion } from "framer-motion";
import { ChevronUp, MapPin, MessageCircle, Phone } from "lucide-react";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { cn } from "@/src/lib/utils";

type QuickAction = {
  label: string;
  href?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
  isExternal?: boolean;
  onClick?: () => void;
  children?: ReactNode;
};

const phoneNumber = "0945523790";
const zaloUrl = `https://zalo.me/${phoneNumber}`;
const facebookUrl = "https://www.facebook.com/baolong.talam/about?locale=vi_VN";
const mapsUrl =
  "https://www.google.com/maps/place/Ph%E1%BB%A5+t%C3%B9ng+xe+m%C3%A1y+Ho%C3%A0ng+Long/@11.1931668,106.7818969,10z/data=!4m10!1m2!2m1!1zUGjhu6UgdMO5bmcgeGUgbcOheSBIb8OgbmcgTG9uZw!3m6!1s0x3174dd4fe41b3d9d:0x407f0ac539707c9d!8m2!3d10.9776302!4d106.8548304!15sCh9QaOG7pSB0w7luZyB4ZSBtw6F5IEhvw6BuZyBMb25nkgEWbW90b3JjeWNsZV9wYXJ0c19zdG9yZeABAA!16s%2Fg%2F11m5_f1rcv?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D";

const quickActions: QuickAction[] = [
  {
    label: "Gọi hotline Hoàng Long",
    href: `tel:${phoneNumber}`,
    icon: Phone,
  },
  {
    label: "Nhắn Zalo Hoàng Long",
    href: zaloUrl,
    icon: MessageCircle,
    isExternal: true,
    children: <span className="text-[10px] font-bold leading-none">Zalo</span>,
  },
  {
    label: "Mở Facebook Hoàng Long",
    href: facebookUrl,
    icon: MessageCircle,
    isExternal: true,
  },
  {
    label: "Xem vị trí cửa hàng",
    href: mapsUrl,
    icon: MapPin,
    isExternal: true,
  },
];

const actionVariants = {
  hidden: {
    opacity: 0,
    x: 28,
    scale: 0.9,
  },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: 0.18 + index * 0.07,
      duration: 0.36,
      ease: "easeOut" as const,
    },
  }),
};

function QuickActionButton({
  label,
  href,
  icon: Icon,
  isExternal,
  onClick,
  children,
  className,
}: QuickAction) {
  const commonClassName = cn(
    "group relative flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-950/20 ring-1 ring-white/40 transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-500 dark:hover:bg-red-400 sm:h-12 sm:w-12",
    className,
  );
  const content = children ?? <Icon className="h-5 w-5" />;

  if (href) {
    return (
      <motion.a
        href={href}
        aria-label={label}
        title={label}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className={commonClassName}
        whileHover={{ y: -3, scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={commonClassName}
      whileHover={{ y: -3, scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
    >
      {content}
    </motion.button>
  );
}

export default function QuickActions() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Thao tác nhanh"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-3 z-40 flex origin-bottom-right flex-col items-center gap-2 sm:bottom-7 sm:right-6 sm:gap-3 [@media(max-width:380px)]:scale-90"
    >
      {quickActions.map((action, index) => (
        <motion.div
          key={action.label}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={actionVariants}
          className="relative"
        >
          <span className="absolute inset-0 rounded-full bg-red-500/30 blur-md transition-opacity group-hover:opacity-80" />
          <QuickActionButton {...action} />
        </motion.div>
      ))}

      <motion.div
        custom={quickActions.length}
        initial="hidden"
        animate="visible"
        variants={actionVariants}
        className="pt-1"
      >
        <QuickActionButton
          label="Lên đầu trang"
          icon={ChevronUp}
          onClick={scrollToTop}
          className="h-12 w-12 bg-white text-red-600 shadow-2xl shadow-zinc-950/15 hover:bg-red-50 dark:bg-zinc-950 dark:text-red-300 dark:hover:bg-red-950 sm:h-14 sm:w-14"
        />
      </motion.div>
    </nav>
  );
}
