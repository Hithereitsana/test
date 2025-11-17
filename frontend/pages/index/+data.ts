import type { PageContextServer } from "vike/types";
import type { AppPageContext } from '../../src/types/pageContext';

declare const process: { env: { API_URL?: string } };

export type Data = Pick<AppPageContext, 'indexes'>;
export default async function data(pageContext: PageContextServer): Promise<Data> {
  const API_URL = process.env.API_URL || 'http://localhost:3000';
  const indexes = await fetch(`${API_URL}/api/indexes/products`);
  if (!indexes.ok) {
    throw new Error(`Failed to fetch indexes: ${indexes.status} ${indexes.statusText}`);
  }
  const data: any = await indexes.json();
  // L'API retourne { indexes: [...] }, on retourne directement l'objet
  return { indexes: data };
}