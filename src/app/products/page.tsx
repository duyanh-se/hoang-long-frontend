"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import {
  fadeUpVariants,
  pageFadeIn,
  scaleInVariants,
  staggerContainerVariants,
  viewportOnce,
} from "../../components/ui/motion";
import { ProductCard } from "../../components/ui/ProductCard";
import productService, {
  Brand,
  Product,
  ProductCategory,
  ProductTag,
} from "../../services/product.service";

const pageSize = 9;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [tags, setTags] = useState<ProductTag[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [activeBrandId, setActiveBrandId] = useState("");
  const [activeTagId, setActiveTagId] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTaxonomyLoading, setIsTaxonomyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTaxonomy() {
      setIsTaxonomyLoading(true);

      try {
        const [categoriesResponse, brandsResponse, tagsResponse] =
          await Promise.all([
            productService.getProductCategories(),
            productService.getBrands(),
            productService.getProductTags(),
          ]);

        setCategories(categoriesResponse.items ?? []);
        setBrands(brandsResponse.items ?? []);
        setTags(tagsResponse.items ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Lỗi khi tải bộ lọc sản phẩm",
        );
      } finally {
        setIsTaxonomyLoading(false);
      }
    }

    loadTaxonomy();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await productService.getProducts({
          search: search.trim() || undefined,
          categoryId: activeCategoryId || undefined,
          brandId: activeBrandId || undefined,
          tagId: activeTagId || undefined,
          page,
          limit: pageSize,
        });

        setProducts(response.items ?? []);
        setTotal(response.total ?? 0);
        setTotalPages(response.totalPages ?? 1);
        setHasNextPage(Boolean(response.hasNextPage));
        setHasPreviousPage(Boolean(response.hasPreviousPage));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi khi tải sản phẩm");
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [activeBrandId, activeCategoryId, activeTagId, page, search]);

  const hasActiveFilters = Boolean(
    search.trim() || activeCategoryId || activeBrandId || activeTagId,
  );

  const paginationPages = useMemo(() => {
    const pages = new Set([1, totalPages, page - 1, page, page + 1]);

    return Array.from(pages)
      .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
      .sort((firstPage, secondPage) => firstPage - secondPage);
  }, [page, totalPages]);

  const resetPageAndSet = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setActiveCategoryId("");
    setActiveBrandId("");
    setActiveTagId("");
    setPage(1);
  };

  return (
    <motion.div
      {...pageFadeIn}
      className="min-h-screen bg-[linear-gradient(180deg,rgba(251,191,36,0.12),rgba(255,255,255,0))] text-foreground"
    >
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
      >
        <motion.div
          variants={scaleInVariants}
          className="rounded-3xl border border-red-100 bg-white/80 p-5 shadow-lg shadow-red-950/5 backdrop-blur dark:border-red-800 dark:bg-red-950/50 sm:rounded-4xl sm:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-300 sm:text-sm sm:tracking-[0.24em]">
                Danh mục sản phẩm
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:mt-4 sm:text-5xl">
                Tìm phụ tùng, dầu nhớt và vật tư bảo dưỡng theo đúng nhu cầu.
              </h1>
            </div>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base sm:leading-8">
              Lọc nhanh theo danh mục, thương hiệu và nhóm sản phẩm để tìm đúng
              phụ tùng, dầu nhớt hoặc vật tư bảo dưỡng cần mua.
            </p>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8"
      >
        <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start">
          <motion.aside
            variants={fadeUpVariants}
            className="rounded-3xl border border-red-100 bg-white/90 p-4 shadow-sm dark:border-red-800 dark:bg-red-950/60 sm:rounded-4xl sm:p-5 lg:sticky lg:top-24"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-500 dark:text-red-300">
                  Bộ lọc
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {isTaxonomyLoading
                    ? "Đang tải bộ lọc..."
                    : `${total} sản phẩm`}
                </p>
              </div>
              <SlidersHorizontal className="h-5 w-5 text-red-600 dark:text-red-300" />
            </div>

            <label className="mt-5 flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Tìm kiếm
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  value={search}
                  onChange={(event) =>
                    resetPageAndSet(setSearch, event.target.value)
                  }
                  placeholder="Nhập tên, mã sản phẩm..."
                  className="h-11 w-full rounded-2xl border border-red-100 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-red-400 dark:border-red-800 dark:bg-red-950 dark:text-white"
                />
              </div>
            </label>

            <label className="mt-4 flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Danh mục
              <select
                value={activeCategoryId}
                onChange={(event) =>
                  resetPageAndSet(setActiveCategoryId, event.target.value)
                }
                className="h-11 rounded-2xl border border-red-100 bg-white px-4 text-sm outline-none transition focus:border-red-400 dark:border-red-800 dark:bg-red-950 dark:text-white"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.productsCount})
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Thương hiệu
              <select
                value={activeBrandId}
                onChange={(event) =>
                  resetPageAndSet(setActiveBrandId, event.target.value)
                }
                className="h-11 rounded-2xl border border-red-100 bg-white px-4 text-sm outline-none transition focus:border-red-400 dark:border-red-800 dark:bg-red-950 dark:text-white"
              >
                <option value="">Tất cả thương hiệu</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name} ({brand.productsCount})
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Tag
              <select
                value={activeTagId}
                onChange={(event) =>
                  resetPageAndSet(setActiveTagId, event.target.value)
                }
                className="h-11 rounded-2xl border border-red-100 bg-white px-4 text-sm outline-none transition focus:border-red-400 dark:border-red-800 dark:bg-red-950 dark:text-white"
              >
                <option value="">Tất cả tag</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name} ({tag.productsCount})
                  </option>
                ))}
              </select>
            </label>

            {hasActiveFilters ? (
              <Button
                type="button"
                onClick={clearFilters}
                className="mt-5 w-full border-red-600 bg-red-600 text-white hover:bg-red-700 dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-400"
              >
                Xóa bộ lọc
              </Button>
            ) : null}
          </motion.aside>

          <motion.div variants={fadeUpVariants}>
            <motion.div
              variants={scaleInVariants}
              className="flex flex-col gap-2 rounded-3xl border border-red-100 bg-white/80 p-4 shadow-sm dark:border-red-800 dark:bg-red-950/50 sm:flex-row sm:items-center sm:justify-between sm:rounded-4xl sm:p-5"
            >
              <div>
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                  {isLoading ? "Đang tải sản phẩm..." : `${total} sản phẩm`}
                </p>
              </div>
              <p className="text-sm font-medium text-red-700 dark:text-red-200">
                Trang {page}/{totalPages}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainerVariants}
              className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {isLoading ? (
                <motion.div
                  variants={fadeUpVariants}
                  className="col-span-full rounded-3xl border border-red-100 bg-red-50/90 p-6 text-center text-zinc-700 shadow-lg shadow-red-950/5 dark:border-red-700 dark:bg-red-950/70 dark:text-zinc-200 sm:rounded-4xl sm:p-8"
                >
                  Đang tải sản phẩm...
                </motion.div>
              ) : error ? (
                <motion.div
                  variants={fadeUpVariants}
                  className="col-span-full rounded-3xl border border-red-200 bg-red-50/90 p-6 text-center text-red-700 shadow-lg shadow-red-950/5 dark:border-red-700 dark:bg-red-950/70 dark:text-red-300 sm:rounded-4xl sm:p-8"
                >
                  {error}
                </motion.div>
              ) : products.length === 0 ? (
                <motion.div
                  variants={fadeUpVariants}
                  className="col-span-full rounded-3xl border border-red-100 bg-red-50/90 p-6 text-center text-zinc-700 shadow-lg shadow-red-950/5 dark:border-red-700 dark:bg-red-950/70 dark:text-zinc-200 sm:rounded-4xl sm:p-8"
                >
                  Không có sản phẩm phù hợp với bộ lọc hiện tại.
                </motion.div>
              ) : (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUpVariants}
              className="mt-6 rounded-3xl border border-red-100 bg-white/80 p-4 shadow-sm dark:border-red-800 dark:bg-red-950/50 sm:mt-8 sm:rounded-4xl"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <Button
                  type="button"
                  variant="neutral"
                  disabled={!hasPreviousPage || isLoading}
                  onClick={() =>
                    setPage((currentPage) => Math.max(1, currentPage - 1))
                  }
                  className="w-full lg:w-auto"
                >
                  Trang trước
                </Button>

                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                    Trang{" "}
                    <span className="text-lg text-red-700 dark:text-red-200">
                      {page}
                    </span>
                    <span className="mx-1 text-zinc-400">/</span>
                    <span className="text-lg text-zinc-950 dark:text-white">
                      {totalPages}
                    </span>
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {paginationPages.map((pageNumber, index) => (
                      <div key={pageNumber} className="flex items-center gap-2">
                        {index > 0 &&
                        pageNumber - paginationPages[index - 1] > 1 ? (
                          <span className="px-1 text-sm font-semibold text-zinc-400">
                            ...
                          </span>
                        ) : null}

                        <Button
                          type="button"
                          variant="neutral"
                          aria-current={
                            pageNumber === page ? "page" : undefined
                          }
                          disabled={isLoading}
                          onClick={() => setPage(pageNumber)}
                          className={`h-10 min-w-10 px-4 ${
                            pageNumber === page
                              ? "border-red-600 bg-red-600 text-white hover:bg-red-700 dark:border-red-500 dark:bg-red-500 dark:text-white dark:hover:bg-red-400"
                              : ""
                          }`}
                        >
                          {pageNumber}
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="h-2 w-full max-w-56 overflow-hidden rounded-full bg-red-100 dark:bg-red-950">
                    <div
                      className="h-full rounded-full bg-red-600 transition-all duration-300 dark:bg-red-400"
                      style={{ width: `${(page / totalPages) * 100}%` }}
                    />
                  </div>

                  <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                    Hiển thị tối đa {pageSize} sản phẩm mỗi trang
                  </p>
                </div>

                <Button
                  type="button"
                  variant="neutral"
                  disabled={!hasNextPage || isLoading}
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  className="w-full lg:w-auto"
                >
                  Trang sau
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}
