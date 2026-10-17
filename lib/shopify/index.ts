import {
  ShopifyProduct,
  Cart,
  NavigationCategory,
  CategorySubItem,
  TaxonomyData,
  CategoryTypePair,
  SeasonalCollectionData,
} from './types';
import {
  getProductsQuery,
  getProductByHandleQuery,
  getCollectionsQuery,
} from './queries/product';
import {
  createCartMutation,
  addToCartMutation,
  updateCartItemMutation,
  removeFromCartMutation,
  getCartQuery,
} from './queries/cart';

/**
 * Executes a GraphQL query against the Shopify Storefront API with retry logic and tag caching.
 */
export async function shopifyFetch<T>({
  query,
  variables = {},
  tags = [],
  cache = 'force-cache',
}: {
  query: string;
  variables?: Record<string, unknown>;
  tags?: string[];
  cache?: RequestCache;
}): Promise<{ status: number; body: T } | never> {
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN || 'cerato-arte-floral.myshopify.com';
  const storefrontAccessToken =
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  const isInvalidToken =
    !storefrontAccessToken || storefrontAccessToken.includes('placeholder');

  if (isInvalidToken) {
    return { status: 401, body: null as unknown as T };
  }

  let attempt = 0;
  const maxAttempts = 3;

  while (attempt < maxAttempts) {
    try {
      const result = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        },
        body: JSON.stringify({ query, variables }),
        cache,
        next: { tags },
      });

      if (result.status === 429) {
        attempt++;
        const waitMs = Math.pow(2, attempt) * 500;
        await new Promise((res) => setTimeout(res, waitMs));
        continue;
      }

      const body = await result.json();

      if (body.errors) {
        console.error('Shopify GraphQL response errors:', body.errors);
        throw new Error(body.errors[0]?.message || 'Shopify GraphQL Error');
      }

      return {
        status: result.status,
        body: body.data,
      };
    } catch (error) {
      attempt++;
      if (attempt >= maxAttempts) {
        console.error('Shopify fetch failed after max retries:', error);
        return { status: 500, body: null as unknown as T };
      }
      const waitMs = Math.pow(2, attempt) * 500;
      await new Promise((res) => setTimeout(res, waitMs));
    }
  }

  return { status: 500, body: null as unknown as T };
}

/**
 * Parses tags for category/type pairings:
 * cat: strictly linked with type:
 * cat2: strictly linked with type2:
 */
export function parseProductTags(product: ShopifyProduct): ShopifyProduct {
  let cat1: string | null = null;
  let cat2: string | null = null;
  let type1: string | null = null;
  let type2: string | null = null;
  const temporada: string[] = [];
  let isFeatured = false;

  (product.tags || []).forEach((tag) => {
    const trimmed = tag.trim();
    if (/^cat:/i.test(trimmed)) {
      cat1 = trimmed.replace(/^cat:/i, '').trim();
    } else if (/^cat2:/i.test(trimmed)) {
      cat2 = trimmed.replace(/^cat2:/i, '').trim();
    } else if (/^type:/i.test(trimmed)) {
      type1 = trimmed.replace(/^type:/i, '').trim();
    } else if (/^type2:/i.test(trimmed)) {
      type2 = trimmed.replace(/^type2:/i, '').trim();
    } else if (/^temporada:/i.test(trimmed)) {
      const val = trimmed.replace(/^temporada:/i, '').trim();
      if (val && !temporada.includes(val)) temporada.push(val);
    } else if (
      trimmed.toLowerCase() === 'productos destacados' ||
      trimmed.toLowerCase() === 'destacado'
    ) {
      isFeatured = true;
    }
  });

  const categoryPairs: CategoryTypePair[] = [];
  const categories: string[] = [];
  const types: string[] = [];

  // Pair 1: cat: linked with type:
  if (cat1) {
    const targetType = type1 || 'Colección General';
    categoryPairs.push({ category: cat1, type: targetType });
    if (!categories.includes(cat1)) categories.push(cat1);
    if (!types.includes(targetType)) types.push(targetType);
  }

  // Pair 2: cat2: linked with type2:
  if (cat2) {
    const targetType = type2 || type1 || 'Colección General';
    categoryPairs.push({ category: cat2, type: targetType });
    if (!categories.includes(cat2)) categories.push(cat2);
    if (!types.includes(targetType)) types.push(targetType);
  }

  return {
    ...product,
    categories,
    types,
    categoryPairs,
    temporada,
    isFeatured,
  };
}

/**
 * Builds taxonomy with strict category-type linking AND case-insensitive deduplication:
 * - Products appear under cat: tab ONLY under section type:
 * - Products appear under cat2: tab ONLY under section type2:
 * - "felicidades" and "FELICIDADES" or "Te amo" and "TE AMO" merge into single sections.
 */
export function buildTaxonomy(products: ShopifyProduct[]): TaxonomyData {
  const parsedProducts = products.map(parseProductTags);

  const categoryMap = new Map<
    string,
    {
      canonicalName: string;
      typeMap: Map<string, { canonicalName: string; products: ShopifyProduct[] }>;
    }
  >();

  const temporadaMap = new Map<string, ShopifyProduct[]>();
  const featuredList: ShopifyProduct[] = [];

  const getCanonicalName = (existing: string | undefined, incoming: string): string => {
    if (!existing) return incoming;
    // Prefer uppercase or title case formatting over all lowercase
    if (incoming === incoming.toUpperCase() && existing !== existing.toUpperCase()) {
      return incoming;
    }
    return existing;
  };

  parsedProducts.forEach((product) => {
    if (product.isFeatured) {
      featuredList.push(product);
    }

    (product.temporada || []).forEach((tempName) => {
      const tempKey = tempName.trim().toLowerCase();
      if (!temporadaMap.has(tempKey)) {
        temporadaMap.set(tempKey, []);
      }
      temporadaMap.get(tempKey)!.push(product);
    });

    const pairs = product.categoryPairs || [];

    pairs.forEach(({ category, type }) => {
      const catKey = category.trim().toLowerCase();
      const typeKey = type.trim().toLowerCase();

      if (!categoryMap.has(catKey)) {
        categoryMap.set(catKey, {
          canonicalName: category.trim(),
          typeMap: new Map(),
        });
      }

      const catEntry = categoryMap.get(catKey)!;
      catEntry.canonicalName = getCanonicalName(catEntry.canonicalName, category.trim());

      if (!catEntry.typeMap.has(typeKey)) {
        catEntry.typeMap.set(typeKey, {
          canonicalName: type.trim(),
          products: [],
        });
      }

      const typeEntry = catEntry.typeMap.get(typeKey)!;
      typeEntry.canonicalName = getCanonicalName(typeEntry.canonicalName, type.trim());

      if (!typeEntry.products.some((p) => p.id === product.id)) {
        typeEntry.products.push(product);
      }
    });
  });

  const categories: NavigationCategory[] = Array.from(categoryMap.values()).map(
    ({ canonicalName, typeMap }) => {
      const subtypes: CategorySubItem[] = Array.from(typeMap.values()).map(
        ({ canonicalName: typeName, products: productList }) => ({
          type: typeName,
          products: productList,
        }),
      );
      return {
        name: canonicalName,
        subtypes,
      };
    },
  );

  return {
    categories,
    temporadaCollections: temporadaMap,
    featuredProducts: featuredList,
  };
}

/**
 * Converts category name to clean URL slug:
 * e.g. "FLORES Y PLANTAS" -> "flores-y-plantas"
 * e.g. "¿Qué quieres decir?" -> "que-quieres-decir"
 */
export function slugifyCategory(categoryName: string): string {
  if (!categoryName) return '';
  return categoryName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Converts a string to PascalCase / Title Case:
 * e.g. "RAMOS Y ATADOS" -> "Ramos Y Atados"
 * e.g. "10 GERBERAS MULTICOLOR" -> "10 Gerberas Multicolor"
 * e.g. "incondicional (rojo)" -> "Incondicional (Rojo)"
 */
export function toPascalCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(/([\s-_/()]+)/)
    .map((word) => {
      if (!word) return '';
      if (word === 'xl') return 'XL';
      if (word === 'xxl') return 'XXL';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

/**
 * Gets all products from Shopify or fallback mock catalog.
 */
export async function getAllProducts(): Promise<ShopifyProduct[]> {
  const response = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>({
    query: getProductsQuery,
    tags: ['products'],
    cache: 'force-cache',
  });

  if (response?.body?.products?.edges) {
    return response.body.products.edges.map((edge) =>
      parseProductTags(edge.node),
    );
  }

  return getMockProducts().map(parseProductTags);
}

/**
 * Gets a single product by handle.
 */
export async function getProductByHandle(
  handle: string,
): Promise<ShopifyProduct | null> {
  const response = await shopifyFetch<{ product: ShopifyProduct }>({
    query: getProductByHandleQuery,
    variables: { handle },
    tags: ['products'],
    cache: 'force-cache',
  });

  if (response?.body?.product) {
    return parseProductTags(response.body.product);
  }

  const mock = getMockProducts().find((p) => p.handle === handle);
  return mock ? parseProductTags(mock) : null;
}

/**
 * Fetches the active seasonal collection whose title begins with "temporada: {nombre}".
 * Returns null if no active seasonal collection is found or if it has no products.
 */
export async function getSeasonalCollection(): Promise<SeasonalCollectionData | null> {
  const response = await shopifyFetch<{
    collections: {
      edges: Array<{
        node: {
          id: string;
          handle: string;
          title: string;
          description: string;
          descriptionHtml?: string;
          products: {
            edges: Array<{ node: ShopifyProduct }>;
          };
        };
      }>;
    };
  }>({
    query: getCollectionsQuery,
    tags: ['collections'],
    cache: 'no-store',
  });

  if (response?.body?.collections?.edges) {
    const collections = response.body.collections.edges.map((edge) => edge.node);
    const seasonal = collections.find((c) => /^temporada:\s*/i.test(c.title));

    if (seasonal) {
      const seasonName = seasonal.title.replace(/^temporada:\s*/i, '').trim();
      const products = seasonal.products.edges.map((edge) =>
        parseProductTags(edge.node),
      );

      if (products.length > 0) {
        return {
          id: seasonal.id,
          handle: seasonal.handle,
          title: seasonal.title,
          seasonName,
          description: seasonal.description || '',
          descriptionHtml: seasonal.descriptionHtml || '',
          products,
        };
      }
    }
  }

  // Fallback: check taxonomy or mock products
  const all = await getAllProducts();
  const taxonomy = buildTaxonomy(all);
  const seasonEntries = Array.from(taxonomy.temporadaCollections.entries());
  if (seasonEntries.length > 0) {
    const [seasonKey, seasonProducts] = seasonEntries[0];
    if (seasonProducts.length > 0) {
      return {
        id: `temporada-${seasonKey}`,
        handle: `temporada-${seasonKey}`,
        title: `temporada: ${seasonKey}`,
        seasonName: seasonKey,
        description: '',
        products: seasonProducts,
      };
    }
  }

  return null;
}

/**
 * Cart API helpers
 */
export async function createCart(
  lines: Array<{ merchandiseId: string; quantity: number }> = [],
): Promise<Cart | null> {
  const res = await shopifyFetch<{
    cartCreate: { cart: Cart; userErrors: Array<{ field: string[]; message: string }> };
  }>({
    query: createCartMutation,
    variables: lines.length > 0 ? { lineItems: lines } : {},
    cache: 'no-store',
  });

  if (res?.body?.cartCreate?.userErrors?.length) {
    console.error('Shopify createCart userErrors:', res.body.cartCreate.userErrors);
  }

  return res?.body?.cartCreate?.cart || null;
}

export async function addToCart(
  cartId: string,
  merchandiseId: string,
  quantity: number = 1,
): Promise<Cart | null> {
  const res = await shopifyFetch<{
    cartLinesAdd: { cart: Cart; userErrors: Array<{ field: string[]; message: string }> };
  }>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines: [{ merchandiseId, quantity }],
    },
    cache: 'no-store',
  });

  if (res?.body?.cartLinesAdd?.userErrors?.length) {
    console.error('Shopify addToCart userErrors:', res.body.cartLinesAdd.userErrors);
    return null;
  }

  return res?.body?.cartLinesAdd?.cart || null;
}

export async function updateCartQuantity(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart | null> {
  const res = await shopifyFetch<{
    cartLinesUpdate: { cart: Cart; userErrors: Array<{ field: string[]; message: string }> };
  }>({
    query: updateCartItemMutation,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
    cache: 'no-store',
  });

  if (res?.body?.cartLinesUpdate?.userErrors?.length) {
    console.error('Shopify updateCartQuantity userErrors:', res.body.cartLinesUpdate.userErrors);
    return null;
  }

  return res?.body?.cartLinesUpdate?.cart || null;
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[],
): Promise<Cart | null> {
  const res = await shopifyFetch<{
    cartLinesRemove: { cart: Cart; userErrors: Array<{ field: string[]; message: string }> };
  }>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: 'no-store',
  });

  if (res?.body?.cartLinesRemove?.userErrors?.length) {
    console.error('Shopify removeFromCart userErrors:', res.body.cartLinesRemove.userErrors);
    return null;
  }

  return res?.body?.cartLinesRemove?.cart || null;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const res = await shopifyFetch<{ cart: Cart }>({
    query: getCartQuery,
    variables: { cartId },
    cache: 'no-store',
  });
  return res?.body?.cart || null;
}

/**
 * Mock Products catalog formatted with exact tag conventions:
 * cat:{categoryName}, cat2:{secondCategoryName}
 * type:{typeName}, type2:{type2Name}
 * temporada:{collectionName}
 * "Productos destacados"
 */
export function getMockProducts(): ShopifyProduct[] {
  return [
    {
      id: 'gid://shopify/Product/1',
      handle: 'cerato-floral-final',
      title: 'Cerato Floral Final',
      description:
        'Una composición magistral que captura la esencia de la primavera eterna en León. Cada tallo ha sido seleccionado por su vigor y belleza.',
      availableForSale: true,
      tags: [
        'cat:FLORES Y PLANTAS',
        'type:Diseños con Base',
        'cat2:EVENTOS Y BODAS',
        'type2:Bridal Bouquet (Novias)',
        'temporada:Navidad',
        'Productos destacados',
      ],
      priceRange: {
        minVariantPrice: { amount: '1450.00', currencyCode: 'MXN' },
        maxVariantPrice: { amount: '1450.00', currencyCode: 'MXN' },
      },
      featuredImage: {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcnF6uyQgzUeAHwhwX2ui_xzBSjzE2N59vxsYy8IlkSlqo-QgEquo4-0DfhPrMAcfeW9Opxe9BjUvj1SXzab7pBvgNkslJ_9PTAZDyJRL928MA1jjzQWo2nwM9rGyxS6HqYHgcn1pHhXRCmyAFirLMO0xEoYv-OLt6xaePIqDXrCFtLk6Ep8BaaW11Qw6FlBASZK18rEvVg4W9RRAMfZMxhAzQQhBcxDagHqOZQw19zeU1ACRAzqUcpaImD7bL46kg1HAN6fX8ow',
        altText: 'Cerato Floral Final',
      },
      images: {
        edges: [
          {
            node: {
              url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcnF6uyQgzUeAHwhwX2ui_xzBSjzE2N59vxsYy8IlkSlqo-QgEquo4-0DfhPrMAcfeW9Opxe9BjUvj1SXzab7pBvgNkslJ_9PTAZDyJRL928MA1jjzQWo2nwM9rGyxS6HqYHgcn1pHhXRCmyAFirLMO0xEoYv-OLt6xaePIqDXrCFtLk6Ep8BaaW11Qw6FlBASZK18rEvVg4W9RRAMfZMxhAzQQhBcxDagHqOZQw19zeU1ACRAzqUcpaImD7bL46kg1HAN6fX8ow',
              altText: 'Cerato Floral Final Vista 1',
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductVariant/101',
              title: 'Default',
              availableForSale: true,
              price: { amount: '1450.00', currencyCode: 'MXN' },
            },
          },
        ],
      },
    },
    {
      id: 'gid://shopify/Product/2',
      handle: '10-gerberas',
      title: '10 Gerberas Multicolor',
      description:
        'Una explosión de alegría en colores vibrantes seleccionados a mano por floristas expertos.',
      availableForSale: true,
      tags: [
        'cat:FLORES Y PLANTAS',
        'type:Ramos y Atados',
        'cat2:OCASIONES',
        'type2:Temáticos y Niños',
        'Productos destacados',
      ],
      priceRange: {
        minVariantPrice: { amount: '450.00', currencyCode: 'MXN' },
        maxVariantPrice: { amount: '450.00', currencyCode: 'MXN' },
      },
      featuredImage: {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv_3_bmSdtd0GnSh5EHK0u0_H56GG3Kf_w-IDOHKIyW-PPwNs_tZR-Rs7AndhnNT7ubLRmz8qDyrlrrfnj-EH2def2GiQ1GRGxUojM7JR3zdP78DT7vnUixzilHMco80LOsqm2fXJPnZjKI5eLlSl7Pbu-uPVTSPvlj_5VfgN1PyYQnSJYTZniJczRyBXhjFV64tzWezEJMtRKx8f_4xWsGtXDnzwh78Lfyc61A-AVBsf0NAx763M53ybxtEfrVUPPt9vK3AjLQw',
        altText: '10 Gerberas Multicolor',
      },
      images: {
        edges: [
          {
            node: {
              url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv_3_bmSdtd0GnSh5EHK0u0_H56GG3Kf_w-IDOHKIyW-PPwNs_tZR-Rs7AndhnNT7ubLRmz8qDyrlrrfnj-EH2def2GiQ1GRGxUojM7JR3zdP78DT7vnUixzilHMco80LOsqm2fXJPnZjKI5eLlSl7Pbu-uPVTSPvlj_5VfgN1PyYQnSJYTZniJczRyBXhjFV64tzWezEJMtRKx8f_4xWsGtXDnzwh78Lfyc61A-AVBsf0NAx763M53ybxtEfrVUPPt9vK3AjLQw',
              altText: '10 Gerberas',
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductVariant/102',
              title: 'Default',
              availableForSale: true,
              price: { amount: '450.00', currencyCode: 'MXN' },
            },
          },
        ],
      },
    },
    {
      id: 'gid://shopify/Product/3',
      handle: 'ramo-rosas-infinito',
      title: 'Ramo de Rosas Infinito',
      description:
        'Un ramo de rosas rojas de tallo largo que simboliza un amor eterno y sofisticado.',
      availableForSale: true,
      tags: [
        'cat:FLORES Y PLANTAS',
        'type:Colección Premium XL',
        'cat2:REGALOS Y MÁS',
        'type2:Postres y Detalles',
        'Productos destacados',
      ],
      priceRange: {
        minVariantPrice: { amount: '1850.00', currencyCode: 'MXN' },
        maxVariantPrice: { amount: '1850.00', currencyCode: 'MXN' },
      },
      featuredImage: {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAxgepMjFTHNBiD4B83cWPQ9yKeGiI2lW0WeKwFKm1TNKSg1_pUo_KuMtUJrCv7PYsLSomHIcXDIaupWvQqCIi1trVrjaCDQWLAXI2vOHgNy_TcErWXNEpc9ZY5-paFLTbvgA1azJMGGaKxA91WnAiu-8FEy99JB-Lg2yBTxbHABfCbyp4aIMFnIkU-Y_mFZ3nfJqZS9GDXMe1Al5g_YiNX5n5s8BLpQq0ZPPamesqraQLTBV8AzikpkWFDl1KgDoU0uw-GsPN4g',
        altText: 'Ramo de Rosas Infinito',
      },
      images: {
        edges: [
          {
            node: {
              url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAxgepMjFTHNBiD4B83cWPQ9yKeGiI2lW0WeKwFKm1TNKSg1_pUo_KuMtUJrCv7PYsLSomHIcXDIaupWvQqCIi1trVrjaCDQWLAXI2vOHgNy_TcErWXNEpc9ZY5-paFLTbvgA1azJMGGaKxA91WnAiu-8FEy99JB-Lg2yBTxbHABfCbyp4aIMFnIkU-Y_mFZ3nfJqZS9GDXMe1Al5g_YiNX5n5s8BLpQq0ZPPamesqraQLTBV8AzikpkWFDl1KgDoU0uw-GsPN4g',
              altText: 'Ramo de Rosas Infinito',
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductVariant/103',
              title: 'Default',
              availableForSale: true,
              price: { amount: '1850.00', currencyCode: 'MXN' },
            },
          },
        ],
      },
    },
    {
      id: 'gid://shopify/Product/4',
      handle: 'orquidea-purpura-imperial',
      title: 'Orquídea Púrpura Imperial',
      description:
        'Una orquídea Phalaenopsis de doble tallo en un tono púrpura profundo y real.',
      availableForSale: true,
      tags: [
        'cat:FLORES Y PLANTAS',
        'type:Flores e Individuales',
      ],
      priceRange: {
        minVariantPrice: { amount: '950.00', currencyCode: 'MXN' },
        maxVariantPrice: { amount: '950.00', currencyCode: 'MXN' },
      },
      featuredImage: {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj_zA4Eyk1BXqKaTe0IAtwHC_Sq17iazaUIfZ_wdE7cBWST0UZxIdzwec5e0lIrRRwVxIvApjqV7jidiKkY3J4-O7xEyif6UpXcn2u2bTyBXcUpTK-xhDNF23nBZGdWSaaW0Rv9XQ0AEXdeCaLwRxDK_heH9gLDt4_o3SkGRBcrvtmdb0RMnfme2YnvaKDXIvZloUa-PrDxVbGdgRu_hk3DW0HleUphzbWnvWmD3uKL0rS4DbYiWdsSpombMwQZ8IQfSGI2PYjaQ',
        altText: 'Orquídea Púrpura Imperial',
      },
      images: {
        edges: [
          {
            node: {
              url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj_zA4Eyk1BXqKaTe0IAtwHC_Sq17iazaUIfZ_wdE7cBWST0UZxIdzwec5e0lIrRRwVxIvApjqV7jidiKkY3J4-O7xEyif6UpXcn2u2bTyBXcUpTK-xhDNF23nBZGdWSaaW0Rv9XQ0AEXdeCaLwRxDK_heH9gLDt4_o3SkGRBcrvtmdb0RMnfme2YnvaKDXIvZloUa-PrDxVbGdgRu_hk3DW0HleUphzbWnvWmD3uKL0rS4DbYiWdsSpombMwQZ8IQfSGI2PYjaQ',
              altText: 'Orquídea Púrpura Imperial',
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductVariant/104',
              title: 'Default',
              availableForSale: true,
              price: { amount: '950.00', currencyCode: 'MXN' },
            },
          },
        ],
      },
    },
  ];
}
