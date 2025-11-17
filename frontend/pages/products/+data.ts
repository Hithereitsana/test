import type { PageContextServer } from "vike/types";
import type { Product } from '../../src/types/product';
import { AppPageContext } from '../../src/types/pageContext';
export type Data = Pick<AppPageContext, 'products'>;

export default async function data(pageContext: PageContextServer): Promise<Data> {
  const { urlOriginal } = pageContext;
  const url = new URL(urlOriginal, 'http://localhost');
  const searchParams = url.searchParams;
  const params = new URLSearchParams();
  const search = searchParams.get('search');
  if (search) {
    params.set('search', search);
  }
  const API_URL = process.env.API_URL || 'http://localhost:3000';
  const fullUrl = `${API_URL}/api/products${params.toString() ? `?${params.toString()}` : ''}`;
  try {
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }
    const data: Product[] = await response.json();
    return { products: data };
  } catch (error) {
    throw error;
  }
}