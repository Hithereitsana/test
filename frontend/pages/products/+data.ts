import type { PageContextServer } from "vike/types";
import type { ProductsResponse } from '../../src/types/product'; //ANAIS: on utilise maintenant ProductsResponse
import { AppPageContext } from '../../src/types/pageContext';

export type Data = Pick<AppPageContext, 'products'>;

export default async function data(pageContext: PageContextServer): Promise<Data> {
  const { urlOriginal } = pageContext;
  const url = new URL(urlOriginal, 'http://localhost');
  const searchParams = url.searchParams;

  const params = new URLSearchParams(searchParams); //ANAIS: on récupère les query params de l'URL

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

    //ANAIS: on récupère les données sous forme de ProductsResponse
    const json = (await response.json()) as ProductsResponse;

    //ANAIS: on passe la réponse complète au store (hydrate sait gérer ProductsResponse)
    return { products: json as any };
  } catch (error) {
    throw error;
  }
}
