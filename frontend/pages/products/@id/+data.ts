import type { PageContextServer } from "vike/types";
import type { Product } from '../../../src/types/product';
import { AppPageContext } from "../../../src/types/pageContext";


export type Data = AppPageContext;

export default async function data(pageContext: PageContextServer): Promise<Data> {
  const { urlOriginal } = pageContext;
  const { id } = pageContext.routeParams;
  const url =new URL(urlOriginal, 'http://localhost');
  const searchParams = url.searchParams;
  const params = new URLSearchParams();
  const API_URL = process.env.API_URL || 'http://localhost:3000';
  const fullUrl = `${API_URL}/api/products?${params.toString()}`;
  try {
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }
    const data: Product[] = await response.json();
    const product = await fetch(`${API_URL}/api/products/${id}`);
    if (!product.ok) {
      throw new Error(`Failed to fetch product: ${product.status} ${product.statusText}`);
    }
    const productData: Product = await product.json();
    return {products:data, product:productData};
  } catch (error) {
    throw error;
  }
}