import type { PageContext } from "vike/types";
export const onPageTransitionStart = async (pageContext: PageContext) => {
  console.log('onPageTransitionStart', pageContext);
};
