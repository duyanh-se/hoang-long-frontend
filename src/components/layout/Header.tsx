"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Minus,
  Moon,
  Menu,
  PhoneCall,
  Plus,
  Send,
  ShoppingCart,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import logoImg from "../../assets/images/Logo_Hoang_Long.jpg";
import { themeClassNames, typographyTokens } from "../../lib/design-tokens";
import { cn, formatVND } from "../../lib/utils";
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
  const increaseCartItem = useCartStore((state) => state.increaseItem);
  const decreaseCartItem = useCartStore((state) => state.decreaseItem);
  const updateCartQuantity = useCartStore((state) => state.updateQuantity);
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
  const [optionalCheckoutVisible, setOptionalCheckoutVisible] = useState(false);

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
    (total, item) =>
      item.requiresQuote ? total : total + item.price * item.quantity,
    0,
  );
  const quoteItemCount = visibleCartItems.filter(
    (item) => item.requiresQuote,
  ).length;

  const ThemeIcon = useMemo(() => (theme === "dark" ? Sun : Moon), [theme]);

  const handleThemeToggle = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const openCartDrawer = useCallback(() => {
    setCheckoutError("");
    setCartDrawerOpen(true);
  }, []);

  const closeCartDrawer = () => {
    setCartDrawerOpen(false);
    setCheckoutVisible(false);
    setCheckoutError("");
    setOptionalCheckoutVisible(false);
  };

  useEffect(() => {
    window.addEventListener("hoang-long-open-cart", openCartDrawer);

    return () => {
      window.removeEventListener("hoang-long-open-cart", openCartDrawer);
    };
  }, [openCartDrawer]);

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
      setOptionalCheckoutVisible(false);
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
        className={themeClassNames.cart.drawer}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.34, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ zIndex: 10000 }}
        role="dialog"
        aria-modal="true"
        aria-label="Giỏ hàng"
      >
        <div className={themeClassNames.cart.header}>
          <div>
            <p
              className={cn(typographyTokens.className.eyebrow, "text-[10px]")}
            >
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

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-5">
          {visibleCartItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-(--brand-border) bg-(--brand-cream) p-5 text-sm text-zinc-600 dark:border-red-800 dark:bg-white/5 dark:text-zinc-300">
              Giỏ hàng đang trống. Hãy thêm sản phẩm từ trang chi tiết.
            </div>
          ) : (
            <div className="space-y-3">
              {visibleCartItems.map((item) => {
                const needsQuote = item.requiresQuote || item.price <= 0;
                const itemSubtotal = item.price * item.quantity;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className={themeClassNames.cart.item}
                  >
                    <div className="flex items-start gap-3">
                      <div className={themeClassNames.cart.image}>
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={`Hình ảnh ${item.name}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                            unoptimized={item.imageUrl.startsWith("data:")}
                          />
                        ) : (
                          <ShoppingCart className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-red-300" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="line-clamp-2 font-semibold text-zinc-950 dark:text-white">
                              {item.name}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-red-700 dark:text-red-200">
                              {needsQuote
                                ? "Liên hệ báo giá"
                                : formatVND(item.price)}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="iconSm"
                            className="h-9 w-9 shrink-0 text-red-700 dark:text-red-200"
                            onClick={() => removeCartItem(item.id)}
                            aria-label={`Xóa ${item.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className={themeClassNames.cart.quantity}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="iconSm"
                              className="h-8 w-8"
                              onClick={() => decreaseCartItem(item.id)}
                              aria-label={`Giảm số lượng ${item.name}`}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <input
                              suppressHydrationWarning
                              value={item.quantity}
                              onChange={(event) =>
                                updateCartQuantity(
                                  item.id,
                                  Number(event.target.value),
                                )
                              }
                              inputMode="numeric"
                              aria-label={`Số lượng ${item.name}`}
                              className="h-8 w-12 bg-transparent text-center text-sm font-semibold text-zinc-950 outline-none dark:text-white"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="iconSm"
                              className="h-8 w-8"
                              onClick={() => increaseCartItem(item.id)}
                              aria-label={`Tăng số lượng ${item.name}`}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                            {needsQuote
                              ? "Chờ tư vấn"
                              : formatVND(itemSubtotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className={themeClassNames.cart.summary}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Tổng số lượng</p>
                <p className="mt-2 text-3xl font-semibold sm:text-4xl">
                  {cartCount}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Tạm tính</p>
                <p className="mt-2 text-xl font-bold sm:text-2xl">
                  {formatVND(cartTotal)}
                </p>
              </div>
            </div>
            {quoteItemCount > 0 ? (
              <p className="mt-4 rounded-2xl bg-white/15 px-3 py-2 text-sm font-semibold text-white dark:bg-white/10">
                {quoteItemCount} sản phẩm cần Hoàng Long xác nhận giá khi tư
                vấn.
              </p>
            ) : null}
          </motion.div>

          {checkoutSuccess ? (
            <div className={themeClassNames.alert.success}>
              <p className="font-semibold">{checkoutSuccess}</p>
              <p className="mt-2 leading-6">
                Nếu cần xử lý gấp, gọi hotline 0945 523 790 để được hỗ trợ nhanh
                hơn.
              </p>
            </div>
          ) : null}

          {checkoutError ? (
            <div className={themeClassNames.alert.error}>
              <p className="font-semibold">{checkoutError}</p>
              <p className="mt-2 leading-6">
                Vui lòng thử lại hoặc gọi trực tiếp 0945 523 790 nếu cần đặt
                hàng ngay.
              </p>
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
              variant="primary"
              className="h-12"
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
                className={themeClassNames.cart.form}
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                    Thông tin đặt hàng
                  </p>
                  <p className={cn("mt-1", typographyTokens.className.small)}>
                    Chỉ cần 3 thông tin chính. Email và ghi chú có thể bổ sung
                    nếu cần.
                  </p>
                </div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Họ tên
                  <input
                    suppressHydrationWarning
                    value={checkoutForm.fullName}
                    onChange={(event) =>
                      setCheckoutForm((current) => ({
                        ...current,
                        fullName: event.target.value,
                      }))
                    }
                    required
                    className={cn("mt-1 h-11 w-full", themeClassNames.field)}
                    placeholder="Nguyễn Văn A"
                  />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Điện thoại
                  <input
                    suppressHydrationWarning
                    type="tel"
                    value={checkoutForm.phoneNumber}
                    onChange={(event) =>
                      setCheckoutForm((current) => ({
                        ...current,
                        phoneNumber: event.target.value,
                      }))
                    }
                    required
                    className={cn("mt-1 h-11 w-full", themeClassNames.field)}
                    placeholder="0901234567"
                  />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Địa chỉ
                  <input
                    suppressHydrationWarning
                    value={checkoutForm.address}
                    onChange={(event) =>
                      setCheckoutForm((current) => ({
                        ...current,
                        address: event.target.value,
                      }))
                    }
                    required
                    className={cn("mt-1 h-11 w-full", themeClassNames.field)}
                    placeholder="Số nhà, phường/xã, quận/huyện..."
                  />
                </label>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setOptionalCheckoutVisible((current) => !current)
                  }
                  className="w-full justify-between rounded-2xl border border-(--brand-border) px-4 dark:border-red-800"
                  aria-expanded={optionalCheckoutVisible}
                >
                  Email / ghi chú thêm
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${optionalCheckoutVisible ? "rotate-180" : ""}`}
                  />
                </Button>

                <AnimatePresence initial={false}>
                  {optionalCheckoutVisible ? (
                    <motion.div
                      key="optional-checkout-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="space-y-3 overflow-hidden"
                    >
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                        Email
                        <input
                          suppressHydrationWarning
                          type="email"
                          value={checkoutForm.email}
                          onChange={(event) =>
                            setCheckoutForm((current) => ({
                              ...current,
                              email: event.target.value,
                            }))
                          }
                          className={cn(
                            "mt-1 h-11 w-full",
                            themeClassNames.field,
                          )}
                          placeholder="email@example.com"
                        />
                      </label>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                        Ghi chú
                        <textarea
                          suppressHydrationWarning
                          value={checkoutForm.note}
                          onChange={(event) =>
                            setCheckoutForm((current) => ({
                              ...current,
                              note: event.target.value,
                            }))
                          }
                          className={cn(
                            "mt-1 min-h-24 w-full py-3",
                            themeClassNames.field,
                          )}
                          placeholder="Thời gian nhận hàng, yêu cầu tư vấn thêm..."
                        />
                      </label>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <a
                  href="tel:0945523790"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-(--brand-border) bg-(--brand-primary-soft) px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200"
                >
                  <PhoneCall className="h-4 w-4" />
                  Cần gấp? Gọi 0945 523 790
                </a>
                <Button
                  type="submit"
                  disabled={isCheckoutSubmitting}
                  variant="primary"
                  className="h-12 w-full"
                >
                  <Send className="mr-2 h-5 w-5" />
                  {isCheckoutSubmitting
                    ? "Đang gửi..."
                    : "Gửi yêu cầu đặt hàng"}
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
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:gap-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2 text-sm font-semibold tracking-[0.16em] text-foreground sm:gap-3 sm:tracking-[0.22em]"
              aria-label="Hoàng Long Motorbike Parts"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl border border-red-200 bg-red-50 shadow-[0_10px_30px_rgba(210,11,11,0.18)] dark:border-red-700 dark:bg-red-950 sm:h-11 sm:w-11">
                <Image
                  src={logoImg}
                  alt="Hoàng Long logo"
                  fill
                  className="object-contain"
                  sizes="44px"
                />
              </div>
              <span className="hidden truncate text-base tracking-[0.18em] text-red-900 sm:inline-flex dark:text-red-300">
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

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
              <Button
                type="button"
                onClick={handleThemeToggle}
                size="icon"
                className="h-10 w-10 sm:h-11 sm:w-11"
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
                className="relative h-10 w-10 sm:h-11 sm:w-11"
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
                className="h-10 w-10 lg:hidden sm:h-11 sm:w-11"
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
                <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
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
