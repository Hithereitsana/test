export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  inStock: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Facets {
  categories: Record<string, number>;
  brands: Record<string, number>;
  priceRange: {
    min: number;
    max: number;
  };
  availability: {
    inStock: number;
    outOfStock: number;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
  facets: Facets;
}

export interface ProductFilters {
  search: string;
  category: string[];
  brand: string[];
  priceMin: number | null;
  priceMax: number | null;
  inStock: boolean | null;
}


