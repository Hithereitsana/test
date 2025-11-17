import { ObjectId } from 'mongodb';

export interface Product {
  _id: ObjectId;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  inStock: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductQueryParams {
  search?: string;
  category?: string | string[];
  brand?: string | string[];
  priceMin?: string;
  priceMax?: string;
  inStock?: string;
  page?: string;
  limit?: string;
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

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  facets: Facets;
}


