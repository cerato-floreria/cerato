import { ShopifyProduct } from './types';

export interface ActiveDiscountRule {
  id: string;
  title: string;
  percentage: number; // e.g. 15 for 15%
  appliesToAll: boolean;
  productIds: Set<string>;
  productTitles: Set<string>;
  collectionIds: Set<string>;
  collectionTitles: Set<string>;
}

let cachedDiscounts: ActiveDiscountRule[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute

let oauthToken: { token: string; expiresAt: number } | null = null;

/**
 * Obtains an Admin API access token.
 * Supports:
 * 1. SHOPIFY_ADMIN_ACCESS_TOKEN if directly defined
 * 2. OAuth 2.0 Client Credentials Grant using SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET
 */
async function getAdminAccessToken(domain: string): Promise<string | null> {
  const directToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (directToken && !directToken.includes('placeholder')) {
    return directToken;
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  const now = Date.now();
  if (oauthToken && oauthToken.expiresAt > now + 60 * 1000) {
    return oauthToken.token;
  }

  try {
    const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId.trim(),
        client_secret: clientSecret.trim(),
        grant_type: 'client_credentials',
      }).toString(),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[Shopify OAuth] Failed to get access token: ${res.status} ${errText}`);
      return null;
    }

    const data = (await res.json()) as { access_token?: string; expires_in?: number };
    if (data.access_token) {
      oauthToken = {
        token: data.access_token,
        expiresAt: now + (data.expires_in ? data.expires_in * 1000 : 23 * 60 * 60 * 1000),
      };
      return oauthToken.token;
    }
  } catch (error) {
    console.error('[Shopify OAuth] Error exchanging client credentials:', error);
  }

  return null;
}

/**
 * Fetches active automatic discounts from Shopify Admin API.
 */
export async function fetchShopifyAdminDiscounts(): Promise<ActiveDiscountRule[]> {
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN || 'cerato-arte-floral.myshopify.com';

  // Use memory cache during server lifetime
  const now = Date.now();
  if (cachedDiscounts && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedDiscounts;
  }

  const rules: ActiveDiscountRule[] = [];

  // Check if global store discount is configured via environment variable
  const envDiscount = process.env.NEXT_PUBLIC_STORE_DISCOUNT_PERCENT || process.env.STORE_DISCOUNT_PERCENT;
  if (envDiscount) {
    const parsedPercent = parseFloat(envDiscount);
    if (!isNaN(parsedPercent) && parsedPercent > 0) {
      rules.push({
        id: 'env-global-discount',
        title: process.env.NEXT_PUBLIC_STORE_DISCOUNT_TITLE || 'Descuento Especial Cerato',
        percentage: parsedPercent > 1 ? parsedPercent : Math.round(parsedPercent * 100),
        appliesToAll: true,
        productIds: new Set(),
        productTitles: new Set(),
        collectionIds: new Set(),
        collectionTitles: new Set(),
      });
    }
  }

  const adminToken = await getAdminAccessToken(domain);

  if (!adminToken) {
    cachedDiscounts = rules;
    lastFetchTime = now;
    return rules;
  }

  try {
    const query = `
      query getActiveDiscounts {
        discountNodes(first: 20, query: "status:active") {
          edges {
            node {
              id
              discount {
                ... on DiscountAutomaticBasic {
                  title
                  status
                  customerGets {
                    value {
                      ... on DiscountPercentage {
                        percentage
                      }
                    }
                    items {
                      ... on AllDiscountItems {
                        allItems
                      }
                      ... on DiscountProducts {
                        products(first: 250) {
                          edges {
                            node {
                              id
                              title
                            }
                          }
                        }
                      }
                      ... on DiscountCollections {
                        collections(first: 50) {
                          edges {
                            node {
                              id
                              title
                            }
                          }
                        }
                      }
                    }
                  }
                }
                ... on DiscountCodeBasic {
                  title
                  status
                  customerGets {
                    value {
                      ... on DiscountPercentage {
                        percentage
                      }
                    }
                    items {
                      ... on AllDiscountItems {
                        allItems
                      }
                      ... on DiscountProducts {
                        products(first: 250) {
                          edges {
                            node {
                              id
                              title
                            }
                          }
                        }
                      }
                      ... on DiscountCollections {
                        collections(first: 50) {
                          edges {
                            node {
                              id
                              title
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const res = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 60, tags: ['discounts'] },
    });

    if (!res.ok) {
      console.warn(`Admin discounts query returned status ${res.status}`);
      cachedDiscounts = rules;
      lastFetchTime = now;
      return rules;
    }

    const json = (await res.json()) as {
      data?: {
        discountNodes?: {
          edges?: Array<{
            node?: {
              id: string;
              discount?: {
                title?: string;
                status?: string;
                customerGets?: {
                  value?: { percentage?: number };
                  items?: {
                    allItems?: boolean;
                    products?: {
                      edges?: Array<{
                        node?: { id: string; title?: string };
                      }>;
                    };
                    collections?: {
                      edges?: Array<{
                        node?: { id: string; title?: string };
                      }>;
                    };
                  };
                };
              };
            };
          }>;
        };
      };
    };

    const edges = json.data?.discountNodes?.edges || [];

    for (const edge of edges) {
      const disc = edge.node?.discount;
      if (!disc || disc.status !== 'ACTIVE') continue;

      const rawPercentage = disc.customerGets?.value?.percentage;
      if (!rawPercentage) continue;

      // Shopify percentage is given as decimal, e.g., 0.21 for 21%
      const percentage = Math.round(rawPercentage * 100);
      const items = disc.customerGets?.items;

      const appliesToAll = Boolean(items?.allItems);
      const productIds = new Set<string>();
      const productTitles = new Set<string>();
      const collectionIds = new Set<string>();
      const collectionTitles = new Set<string>();

      (items?.products?.edges || []).forEach((p) => {
        if (p.node?.id) {
          productIds.add(p.node.id);
          const rawId = p.node.id.split('/').pop();
          if (rawId) productIds.add(rawId);
        }
        if (p.node?.title) {
          productTitles.add(p.node.title.trim().toLowerCase());
        }
      });

      (items?.collections?.edges || []).forEach((c) => {
        if (c.node?.id) {
          collectionIds.add(c.node.id);
          const rawId = c.node.id.split('/').pop();
          if (rawId) collectionIds.add(rawId);
        }
        if (c.node?.title) {
          collectionTitles.add(c.node.title.trim().toLowerCase());
        }
      });

      rules.push({
        id: edge.node?.id || disc.title || 'Descuento',
        title: disc.title || 'Descuento',
        percentage,
        appliesToAll,
        productIds,
        productTitles,
        collectionIds,
        collectionTitles,
      });
    }

    cachedDiscounts = rules;
    lastFetchTime = now;
  } catch (err) {
    console.error('Error fetching Shopify Admin discounts:', err);
  }

  return rules;
}

/**
 * Calculates the active discount percentage and details for a given product.
 * Checks:
 * 1. Active Shopify discount rules (from Admin API or env)
 * 2. Product tags like `descuento:20`, `discount:15`, `-15%`
 * 3. compareAtPrice fallback
 */
export function resolveProductDiscount(
  product: ShopifyProduct,
  activeRules: ActiveDiscountRule[] = cachedDiscounts || []
): {
  hasDiscount: boolean;
  discountPercent: number;
  discountTitle?: string;
} {
  const normTitle = product.title?.trim().toLowerCase() || '';
  const rawId = product.id?.split('/').pop() || '';

  // 1. Check active rules
  for (const rule of activeRules) {
    if (rule.appliesToAll) {
      return {
        hasDiscount: true,
        discountPercent: rule.percentage,
        discountTitle: rule.title,
      };
    }

    if (
      (product.id && rule.productIds.has(product.id)) ||
      (rawId && rule.productIds.has(rawId)) ||
      (normTitle && rule.productTitles.has(normTitle))
    ) {
      return {
        hasDiscount: true,
        discountPercent: rule.percentage,
        discountTitle: rule.title,
      };
    }

    // Check if product belongs to any discounted collection
    if (product.collections?.edges) {
      for (const col of product.collections.edges) {
        const colTitle = col.node.title?.trim().toLowerCase() || '';
        const colRawId = col.node.id?.split('/').pop() || '';
        if (
          (col.node.id && rule.collectionIds.has(col.node.id)) ||
          (colRawId && rule.collectionIds.has(colRawId)) ||
          (colTitle && rule.collectionTitles.has(colTitle))
        ) {
          return {
            hasDiscount: true,
            discountPercent: rule.percentage,
            discountTitle: rule.title,
          };
        }
      }
    }
  }

  // 2. Check tags (e.g. "descuento:15", "discount:20", "-15%", "oferta:25")
  for (const tag of product.tags || []) {
    const match = tag.match(/(?:descuento|discount|oferta|rebaja):\s*(\d+)/i) ||
                  tag.match(/-?(\d+)%\s*(?:off|descuento)?/i);
    if (match && match[1]) {
      const pct = parseInt(match[1], 10);
      if (pct > 0 && pct < 100) {
        return {
          hasDiscount: true,
          discountPercent: pct,
          discountTitle: 'Descuento',
        };
      }
    }
  }

  return {
    hasDiscount: false,
    discountPercent: 0,
  };
}

