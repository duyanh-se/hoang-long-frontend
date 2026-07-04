import apiClient from "../lib/axios";

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  productsCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  productsCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductTag {
  id: string;
  name: string;
  slug: string;
  productsCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price?: number | null;
  imageBase64?: string | null;
  imageUrl?: string | null;
  imageMimeType?: string | null;
  specs?: Record<string, unknown> | null;
  category?: Pick<ProductCategory, "id" | "name" | "slug"> | null;
  brand?: Pick<Brand, "id" | "name" | "slug"> | null;
  tags?: Pick<ProductTag, "id" | "name" | "slug">[] | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  search?: string;
  includeInactive?: boolean;
  categoryId?: string;
  brandId?: string;
  tagId?: string;
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FeaturedProduct {
  id: string;
  badge?: string | null;
  titleOverride?: string | null;
  descriptionOverride?: string | null;
  sortOrder: number;
  isActive: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  product: Product;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeaturedProductListResponse {
  items: FeaturedProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductCategoryListResponse {
  items: ProductCategory[];
  total: number;
}

export interface BrandListResponse {
  items: Brand[];
  total: number;
}

export interface ProductTagListResponse {
  items: ProductTag[];
  total: number;
}

const productService = {
  getProducts: async (
    filters: ProductFilters = {},
  ): Promise<ProductListResponse> => {
    const query = {
      ...(filters.search ? { search: filters.search } : {}),
      ...(filters.includeInactive ? { includeInactive: true } : {}),
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.brandId ? { brandId: filters.brandId } : {}),
      ...(filters.tagId ? { tagId: filters.tagId } : {}),
      ...(filters.page ? { page: filters.page } : {}),
      ...(filters.limit ? { limit: filters.limit } : {}),
    };

    return apiClient.get<ProductListResponse>("/products", {
      params: query,
    });
  },

  getProductById: async (id: string): Promise<Product> => {
    return apiClient.get<Product>(`/products/${id}`);
  },

  getFeaturedProducts: async (
    filters: Pick<ProductFilters, "page" | "limit" | "includeInactive"> = {},
  ): Promise<FeaturedProductListResponse> => {
    const query = {
      ...(filters.page ? { page: filters.page } : {}),
      ...(filters.limit ? { limit: filters.limit } : {}),
      ...(filters.includeInactive ? { includeInactive: true } : {}),
    };

    return apiClient.get<FeaturedProductListResponse>("/products/featured", {
      params: query,
    });
  },

  getProductCategories: async (): Promise<ProductCategoryListResponse> => {
    return apiClient.get<ProductCategoryListResponse>("/product-categories");
  },

  getBrands: async (): Promise<BrandListResponse> => {
    return apiClient.get<BrandListResponse>("/brands");
  },

  getProductTags: async (): Promise<ProductTagListResponse> => {
    return apiClient.get<ProductTagListResponse>("/product-tags");
  },
};

export default productService;
