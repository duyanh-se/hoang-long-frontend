"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Moon,
  Menu,
  Send,
  ShoppingCart,
  Sun,
  X,
} from "lucide-react";
import logoImg from "../../assets/images/Logo_Hoang_Long.jpg";
import { formatVND } from "../../lib/utils";
import consultationService from "../../services/consultation.service";
import { useCartStore } from "../../store/useCartStore";
import { Button } from "../ui/Button";

const navigationItems = [
  { id: "home", label: "Trang chủ", href: "/" },
  { id: "products", label: "Sản phẩm", href: "/products" },
  { id: "contact", label: "Liên hệ", href: "/#tu-van" },
];

type ThemeMode = "light" | "dark";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [themeInitialized, setThemeInitialized] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const cartItems = useCartStore((state) => state.items);
  const removeCartItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    note: "",
  });
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState("");
  const [isCheckoutSubmitting, setIsCheckoutSubmitting] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const savedTheme = window.localStorage.getItem("hoang-long-theme");
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      setTheme(
        savedTheme === "dark" || savedTheme === "light"
          ? savedTheme
          : systemTheme,
      );
      setThemeInitialized(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!themeInitialized) {
      return;
    }

    window.localStorage.setItem("hoang-long-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme, themeInitialized]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setHasHydrated(true), 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!cartDrawerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [cartDrawerOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollYRef.current;
      const passedThreshold = currentScrollY > 80;

      if (mobileMenuOpen || cartDrawerOpen || currentScrollY < 8) {
        setHeaderHidden(false);
      } else {
        setHeaderHidden(scrollingDown && passedThreshold);
      }

      lastScrollYRef.current = currentScrollY;
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [cartDrawerOpen, mobileMenuOpen]);

  const visibleCartItems = hasHydrated ? cartItems : [];
  const cartCount = visibleCartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const cartTotal = visibleCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const ThemeIcon = useMemo(() => (theme === "dark" ? Sun : Moon), [theme]);

  const handleThemeToggle = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const openCartDrawer = () => {
    setCheckoutError("");
    setCartDrawerOpen(true);
  };

  const closeCartDrawer = () => {
    setCartDrawerOpen(false);
    setCheckoutVisible(false);
    setCheckoutError("");
  };

  const handleCheckoutSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (visibleCartItems.length === 0) {
      setCheckoutError("Giỏ hàng đang trống.");
      return;
    }

    setIsCheckoutSubmitting(true);
    setCheckoutError("");
    setCheckoutSuccess("");

    try {
      await consultationService.createCartCheckout({
        fullName: checkoutForm.fullName.trim(),
        email: checkoutForm.email.trim() || undefined,
        phoneNumber: checkoutForm.phoneNumber.trim(),
        address: checkoutForm.address.trim(),
        note: checkoutForm.note.trim() || undefined,
        items: visibleCartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      setCheckoutVisible(false);
      setCheckoutSuccess(
        "Đặt hàng thành công. Hoàng Long sẽ liên hệ xác nhận sớm.",
      );
      setCheckoutForm({
        fullName: "",
        email: "",
        phoneNumber: "",
        address: "",
        note: "",
      });
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Không thể gửi đơn đặt hàng.",
      );
    } finally {
      setIsCheckoutSubmitting(false);
    }
  };

  const headerVisible = !headerHidden || mobileMenuOpen || cartDrawerOpen;

  const cartDrawer = cartDrawerOpen ? (
    <motion.div
      className="fixed inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      style={{ zIndex: 9999 }}
    >
      <Button
        type="button"
        variant="overlay"
        size="overlay"
        className="absolute inset-0 rounded-none bg-black/55 backdrop-blur-sm hover:bg-black/55"
        onClick={closeCartDrawer}
        aria-label="Đóng giỏ hàng"
      />
      <motion.aside
        className="absolute right-0 top-0 flex h-dvh w-full max-w-md flex-col border-l border-black/10 bg-background shadow-2xl dark:border-white/10"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.34, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ zIndex: 10000 }}
        role="dialog"
        aria-modal="true"
        aria-label="Giỏ hàng"
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
              Cart
            </p>
            <h2 className="text-lg font-semibold text-foreground">Giỏ hàng</h2>
          </div>
          <Button
            type="button"
            onClick={closeCartDrawer}
            variant="neutral"
            size="iconSm"
            aria-label="Đóng drawer giỏ hàng"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
          {visibleCartItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-black/15 bg-white p-5 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              Giỏ hàng đang trống. Hãy thêm sản phẩm từ trang chi tiết.
            </div>
          ) : (
            <div className="space-y-3">
              {visibleCartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="rounded-3xl border border-red-100 bg-white p-4 shadow-sm dark:border-red-800 dark:bg-red-950/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-zinc-950 dark:text-white">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 px-3 text-xs text-red-700 dark:text-red-200"
                      onClick={() => removeCartItem(item.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-red-700 dark:text-red-200">
                    {formatVND(item.price * item.quantity)}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="rounded-3xl bg-[linear-gradient(135deg,rgba(251,191,36,1),rgba(249,115,22,1))] p-5 text-zinc-950 dark:bg-[linear-gradient(135deg,rgba(58,54,54,1),rgba(17,17,17,1))] dark:text-zinc-50"
          >
            <p className="text-sm font-medium">Số lượng sản phẩm</p>
            <p className="mt-2 text-4xl font-semibold">{cartCount}</p>
            <p className="mt-3 text-sm font-semibold">
              Tạm tính: {formatVND(cartTotal)}
            </p>
          </motion.div>

          {checkoutSuccess ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
              {checkoutSuccess}
            </div>
          ) : null}

          {checkoutError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
              {checkoutError}
            </div>
          ) : null}

          {visibleCartItems.length > 0 ? (
            <Button
              type="button"
              onClick={() => {
                setCheckoutSuccess("");
                setCheckoutError("");
                setCheckoutVisible((current) => !current);
              }}
              className="h-12 border-red-600 bg-red-600 text-white hover:bg-red-700 dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-400"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {checkoutVisible ? "Ẩn thông tin đặt hàng" : "Mua hàng"}
            </Button>
          ) : null}

          <AnimatePresence initial={false}>
            {checkoutVisible && visibleCartItems.length > 0 ? (
              <motion.form
                key="checkout-form"
                initial={{ opacity: 0, height: 0, y: 16 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: 16 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                onSubmit={handleCheckoutSubmit}
                className="space-y-3 overflow-hidden rounded-3xl border border-red-100 bg-white p-4 shadow-sm dark:border-red-800 dark:bg-red-950/70"
              >
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Thông tin đặt hàng
                </p>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Họ tên
                  <input
                    value={checkoutForm.fullName}
                    onChange={(event) =>
                      setCheckoutForm((current) => ({
                        ...current,
                        fullName: event.target.value,
                      }))
                    }
                    required
                    className="mt-1 h-11 w-full rounded-2xl border border-red-100 bg-white px-4 text-sm outline-none transition focus:border-red-400 dark:border-red-800 dark:bg-red-950 dark:text-white"
                    placeholder="Nguyễn Văn A"
                  />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Email
                  <input
                    type="email"
                    value={checkoutForm.email}
                    onChange={(event) =>
                      setCheckoutForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    className="mt-1 h-11 w-full rounded-2xl border border-red-100 bg-white px-4 text-sm outline-none transition focus:border-red-400 dark:border-red-800 dark:bg-red-950 dark:text-white"
                    placeholder="email@example.com"
                  />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Điện thoại
                  <input
                    value={checkoutForm.phoneNumber}
                    onChange={(event) =>
                      setCheckoutForm((current) => ({
                        ...current,
                        phoneNumber: event.target.value,
                      }))
                    }
                    required
                    className="mt-1 h-11 w-full rounded-2xl border border-red-100 bg-white px-4 text-sm outline-none transition focus:border-red-400 dark:border-red-800 dark:bg-red-950 dark:text-white"
                    placeholder="0901234567"
                  />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Địa chỉ
                  <input
                    value={checkoutForm.address}
                    onChange={(event) =>
                      setCheckoutForm((current) => ({
                        ...current,
                        address: event.target.value,
                      }))
                    }
                    required
                    className="mt-1 h-11 w-full rounded-2xl border border-red-100 bg-white px-4 text-sm outline-none transition focus:border-red-400 dark:border-red-800 dark:bg-red-950 dark:text-white"
                    placeholder="Số nhà, phường/xã, quận/huyện..."
                  />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Ghi chú
                  <textarea
                    value={checkoutForm.note}
                    onChange={(event) =>
                      setCheckoutForm((current) => ({
                        ...current,
                        note: event.target.value,
                      }))
                    }
                    className="mt-1 min-h-24 w-full rounded-2xl border border-red-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-400 dark:border-red-800 dark:bg-red-950 dark:text-white"
                    placeholder="Thời gian nhận hàng, yêu cầu tư vấn thêm..."
                  />
                </label>
                <Button
                  type="submit"
                  disabled={isCheckoutSubmitting}
                  className="h-12 w-full border-red-600 bg-red-600 text-white hover:bg-red-700 dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-400"
                >
                  <Send className="mr-2 h-5 w-5" />
                  {isCheckoutSubmitting ? "Đang gửi..." : "Đặt hàng"}
                </Button>
              </motion.form>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.aside>
    </motion.div>
  ) : null;

  return (
    <>
      <header className="sticky top-0 z-50">
        <motion.div
          initial={{ y: -24, opacity: 0 }}
          animate={{
            y: headerVisible ? 0 : "-100%",
            opacity: headerVisible ? 1 : 0,
          }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="border-b border-black/10 bg-background/95 backdrop-blur-xl will-change-transform dark:border-white/10"
        >
          <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="flex items-center gap-3 text-sm font-semibold tracking-[0.22em] text-foreground"
              aria-label="Hoàng Long Motorbike Parts"
            >
              <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-red-200 bg-red-50 shadow-[0_10px_30px_rgba(210,11,11,0.18)] dark:border-red-700 dark:bg-red-950">
                <Image
                  src={logoImg}
                  alt="Hoàng Long logo"
                  fill
                  className="object-contain"
                  sizes="44px"
                />
              </div>
              <span className="hidden text-base tracking-[0.18em] text-red-900 sm:inline-flex dark:text-red-300">
                Hoàng Long
              </span>
            </Link>

            <nav className="hidden items-center gap-1 rounded-full border border-red-200 bg-red-50/80 p-1 shadow-sm backdrop-blur dark:border-red-700 dark:bg-red-950/40 lg:flex">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-red-900 transition-colors hover:bg-red-100 hover:text-red-950 dark:text-red-100 dark:hover:bg-red-700/20 dark:hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                type="button"
                onClick={handleThemeToggle}
                size="icon"
                aria-label={
                  theme === "dark"
                    ? "Chuyển sang light mode"
                    : "Chuyển sang dark mode"
                }
              >
                <ThemeIcon className="h-5 w-5" />
              </Button>

              <Button
                type="button"
                onClick={openCartDrawer}
                size="icon"
                className="relative"
                aria-label="Mở giỏ hàng"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                  {cartCount}
                </span>
              </Button>

              <Button
                type="button"
                onClick={() => setMobileMenuOpen((current) => !current)}
                variant="neutral"
                size="icon"
                className="lg:hidden"
                aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
                aria-expanded={mobileMenuOpen}
              >
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <Menu
                    className={`absolute h-5 w-5 transition-all duration-200 ${mobileMenuOpen ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`}
                  />
                  <X
                    className={`absolute h-5 w-5 transition-all duration-200 ${mobileMenuOpen ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"}`}
                  />
                </span>
              </Button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {mobileMenuOpen ? (
              <motion.div
                key="mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="overflow-hidden border-t border-black/10 bg-background/95 dark:border-white/10 lg:hidden"
              >
                <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.22, delay: index * 0.04 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-950 transition-colors hover:bg-red-100 dark:border-red-700 dark:bg-red-950/90 dark:text-red-100 dark:hover:bg-red-800/70"
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="h-4 w-4 -rotate-90 opacity-60" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </header>
      {hasHydrated && typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>{cartDrawer}</AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
