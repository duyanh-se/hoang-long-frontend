import { create } from "zustand";
import productService, {
  Product,
  ProductFilters,
  ProductListResponse,
} from "@/src/services/product.service";

interface ProductState {
  products: Product[];
  total: number;
  selectedProduct: Product | null;
  search: string;
  includeInactive: boolean;
  categoryId: string;
  brandId: string;
  tagId: string;
  isLoading: boolean;
  error: string | null;
  fetchProducts: (filters?: Partial<ProductFilters>) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  setSearch: (search: string) => void;
  setIncludeInactive: (includeInactive: boolean) => void;
  setCategoryId: (categoryId: string) => void;
  setBrandId: (brandId: string) => void;
  setTagId: (tagId: string) => void;
  clearError: () => void;
  reset: () => void;
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  total: 0,
  selectedProduct: null,
  search: "",
  includeInactive: false,
  categoryId: "",
  brandId: "",
  tagId: "",
  isLoading: false,
  error: null,

  fetchProducts: async (filters = {}) => {
    set({ isLoading: true, error: null });

    try {
      const query: ProductFilters = {
        search: get().search,
        includeInactive: get().includeInactive,
        categoryId: get().categoryId || undefined,
        brandId: get().brandId || undefined,
        tagId: get().tagId || undefined,
        ...filters,
      };

      const response: ProductListResponse =
        await productService.getProducts(query);

      set({
        products: response.items ?? [],
        total: response.total ?? response.items.length,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Lỗi khi tải danh sách sản phẩm",
        isLoading: false,
      });
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const product = await productService.getProductById(id);
      set({ selectedProduct: product, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Lỗi khi tải dữ liệu sản phẩm",
        isLoading: false,
      });
    }
  },

  setSearch: (search) => set({ search }),
  setIncludeInactive: (includeInactive) => set({ includeInactive }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setBrandId: (brandId) => set({ brandId }),
  setTagId: (tagId) => set({ tagId }),
  clearError: () => set({ error: null }),
  reset: () =>
    set({
      products: [],
      total: 0,
      selectedProduct: null,
      search: "",
      includeInactive: false,
      categoryId: "",
      brandId: "",
      tagId: "",
      isLoading: false,
      error: null,
    }),
}));
