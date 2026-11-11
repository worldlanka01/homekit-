import { Product } from '../types/product';
import { ALL_PRODUCTS } from '../data/products';

/**
 * Creates a clean, URL-safe slug from a product name.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates a permanent, collision-free slug for a product incorporating its ID.
 * Example: "10 in 1 Mandoline Slicer", ID: "2108" -> "10-in-1-mandoline-slicer-2108"
 */
export function getProductSlug(product: Product): string {
  if (product.slug) return product.slug;
  const nameSlug = slugify(product.name);
  return `${nameSlug}-${product.id}`;
}

/**
 * Generates the standard URL anchor href for a product.
 * Returns `#product-${product.id}` for maximum browser and iframe compatibility.
 */
export function getProductHref(product: Product): string {
  return `#product-${product.id}`;
}

// Fast pre-indexed lookup maps for O(1) instantaneous product resolution
const PRODUCT_BY_ID = new Map<string, Product>();
const PRODUCT_BY_SLUG = new Map<string, Product>();
const PRODUCT_BY_CLEAN_NAME = new Map<string, Product>();

// Initialize indices once on module import
ALL_PRODUCTS.forEach((product) => {
  if (!product.slug) {
    product.slug = getProductSlug(product);
  }
  PRODUCT_BY_ID.set(product.id, product);
  PRODUCT_BY_SLUG.set(product.slug, product);

  const cleanName = slugify(product.name);
  PRODUCT_BY_CLEAN_NAME.set(cleanName, product);
});

/**
 * Cleanly extracts a raw identifier from any URL hash, path, or param.
 */
export function normalizeProductIdentifier(raw: string): string {
  let cleaned = decodeURIComponent(raw).trim();

  // Strip leading query string or hash symbol if present
  if (cleaned.startsWith('#')) cleaned = cleaned.slice(1);
  if (cleaned.startsWith('?')) cleaned = cleaned.slice(1);

  // Strip common routing prefixes
  const prefixes = [
    '/products/',
    '/product/',
    'products/',
    'product/',
    'product-',
    'product=',
    'id=',
    'p=',
    'item=',
    'p-',
    'item-'
  ];

  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.slice(prefix.length);
      break;
    }
  }

  // Strip trailing slash or query params
  cleaned = cleaned.split('?')[0].split('&')[0].replace(/\/+$/, '');

  return cleaned;
}

/**
 * Strictly and deterministically resolves a product from an ID, slug, or URL identifier.
 * NEVER returns a random or incorrect product. Returns null if not found.
 */
export function resolveProduct(identifier: string | null | undefined): Product | null {
  if (!identifier) return null;

  const normalized = normalizeProductIdentifier(identifier);
  if (!normalized) return null;

  // 1. Direct O(1) lookup by exact Product ID (e.g. "2108")
  const byId = PRODUCT_BY_ID.get(normalized);
  if (byId) return byId;

  // 2. Direct O(1) lookup by full slug (e.g. "10-in-1-mandoline-slicer-2108")
  const bySlug = PRODUCT_BY_SLUG.get(normalized);
  if (bySlug) return bySlug;

  // 3. Lookup by clean name without ID (e.g. "10-in-1-mandoline-slicer")
  const byName = PRODUCT_BY_CLEAN_NAME.get(normalized);
  if (byName) return byName;

  // 4. Extract trailing numeric ID from slug pattern (e.g. "any-product-title-2108")
  const matchTrailingId = normalized.match(/(?:^|-)([0-9]{3,6})$/);
  if (matchTrailingId && matchTrailingId[1]) {
    const trailingProduct = PRODUCT_BY_ID.get(matchTrailingId[1]);
    if (trailingProduct) return trailingProduct;
  }

  return null;
}

/**
 * Resolves the currently active product directly from browser location
 * (supporting hash routes, query params, and pathname).
 */
export function resolveProductFromLocation(): Product | null {
  if (typeof window === 'undefined') return null;

  // 1. Check URL hash (e.g. #product-2108, #/product/2108, #2108, #10-in-1-mandoline-slicer-2108)
  const hash = window.location.hash;
  if (hash && hash !== '#' && hash !== '#collection' && hash !== '#about-us' && hash !== '#social-media') {
    const fromHash = resolveProduct(hash);
    if (fromHash) return fromHash;
  }

  // 2. Check Search Query parameters (e.g. ?product=2108, ?id=2108, ?p=2108)
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const paramVal = searchParams.get('product') || searchParams.get('id') || searchParams.get('p') || searchParams.get('item');
    if (paramVal) {
      const fromParam = resolveProduct(paramVal);
      if (fromParam) return fromParam;
    }
  } catch {
    // Ignore URLSearchParams parsing in unusual environments
  }

  // 3. Check Pathname (e.g. /product/2108, /products/2108)
  const pathname = window.location.pathname;
  if (pathname.includes('/product/') || pathname.includes('/products/')) {
    const fromPath = resolveProduct(pathname);
    if (fromPath) return fromPath;
  }

  return null;
}

/**
 * Updates document.title and meta tags to strictly match the active product or home collection.
 */
export function syncDocumentTitle(product?: Product | null): void {
  if (typeof document === 'undefined') return;

  if (product) {
    document.title = `${product.name} | HomeKit`;
  } else {
    document.title = 'HomeKit - Premium Home & Living Store';
  }
}
