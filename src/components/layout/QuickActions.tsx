"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, MapPin, MessageCircle, Phone, X } from "lucide-react";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { useState } from "react";
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
    y: 12,
    scale: 0.96,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.04,
      duration: 0.24,
      ease: "easeOut" as const,
    },
  }),
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.96,
    transition: {
      duration: 0.18,
      ease: "easeIn" as const,
    },
  },
};

function QuickActionButton({
  label,
  href,
  icon: Icon,
  isExternal,
  onClick,
  children,
  className,
  onSelect,
}: QuickAction & { onSelect?: () => void }) {
  const commonClassName = cn(
    "group flex min-h-12 w-64 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-red-100 bg-white/95 px-4 py-3 text-left text-sm font-semibold text-zinc-800 shadow-xl shadow-red-950/10 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:border-red-800 dark:bg-red-950/95 dark:text-zinc-100 dark:hover:bg-red-900/70",
    className,
  );
  const content = children ?? <Icon className="h-5 w-5" />;
  const iconWrapper = (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-950/15 transition group-hover:scale-105 dark:bg-red-500">
      {content}
    </span>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        aria-label={label}
        title={label}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className={commonClassName}
        onClick={onSelect}
        whileTap={{ scale: 0.98 }}
      >
        {iconWrapper}
        <span className="min-w-0 flex-1">{label}</span>
      </motion.a>
    );
  }

  return (
    <motion.button
      suppressHydrationWarning
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        onClick?.();
        onSelect?.();
      }}
      className={commonClassName}
      whileTap={{ scale: 0.98 }}
    >
      {iconWrapper}
      <span className="min-w-0 flex-1">{label}</span>
    </motion.button>
  );
}

export default function QuickActions() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const actionsWithTop: QuickAction[] = [
    ...quickActions,
    {
      label: "Lên đầu trang",
      icon: ChevronUp,
      onClick: scrollToTop,
    },
  ];

  return (
    <nav
      aria-label="Thao tác nhanh"
      className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-3 z-40 flex origin-bottom-right flex-col items-end gap-3 sm:bottom-7 sm:right-6 [@media(max-width:380px)]:scale-90"
    >
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="quick-actions-menu"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col items-end gap-2"
          >
            {actionsWithTop.map((action, index) => (
              <motion.div
                key={action.label}
                custom={index}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={actionVariants}
              >
                <QuickActionButton
                  {...action}
                  onSelect={() => setMenuOpen(false)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        suppressHydrationWarning
        type="button"
        aria-label={menuOpen ? "Đóng thao tác nhanh" : "Mở thao tác nhanh"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((current) => !current)}
        className="group flex h-14 items-center gap-2 rounded-full bg-red-600 px-4 text-sm font-bold text-white shadow-2xl shadow-red-950/25 ring-1 ring-white/40 transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-500 dark:hover:bg-red-400"
        initial={{ opacity: 0, y: 18, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        whileHover={{ y: -2, scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
          {menuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <MessageCircle className="h-5 w-5" />
          )}
        </span>
        <span className="hidden sm:inline">Liên hệ nhanh</span>
      </motion.button>
    </nav>
  );
}
