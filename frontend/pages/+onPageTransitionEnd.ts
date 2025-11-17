import type { PageContext } from "vike/types";
import type { AppPageContext } from '../src/types/pageContext';
import { hydrateStores } from './hydrateStores';

export const onPageTransitionEnd = async (pageContext: PageContext) => {
  const dataSource = pageContext.data as Partial<AppPageContext> | undefined;
  hydrateStores(dataSource);
};
