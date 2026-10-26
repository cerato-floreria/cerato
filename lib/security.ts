/**
 * Security and sanitization utilities for user-submitted text and identifiers.
 */

/**
 * Validates that an identifier matches Shopify Storefront API expected formats.
 * e.g., "gid://shopify/Cart/c1-xxx?key=yyy" or base64 strings.
 */
export function isValidShopifyId(id: unknown): boolean {
  if (typeof id !== "string") return false;
  const trimmed = id.trim();
  if (!trimmed || trimmed.length > 512) return false;
  // Shopify IDs are URIs or base64 strings (e.g. gid://shopify/Cart/...?key=...)
  // Disallow control characters, whitespace, newlines, quotes, and HTML tags
  return !/[\s\r\n\x00-\x1F\x7F<>"'`\\]/.test(trimmed);
}

/**
 * Sanitizes user-provided text for Shopify order attributes, delivery instructions,
 * and greeting cards:
 * 1. Rejects non-string inputs.
 * 2. Normalizes unicode characters (NFC).
 * 3. Strips null bytes and invisible control characters.
 * 4. Strips unicode directional override characters (used in spoofing / bidi attacks).
 * 5. Strips <script> and <style> blocks and their inner contents.
 * 6. Strips all standard HTML tags (e.g., <div>, <img>, <a>) while preserving common emoticons like "<3".
 * 7. Normalizes line breaks and collapses excessive consecutive newlines (max 2).
 * 8. Trims leading/trailing whitespace.
 * 9. Enforces a strict maximum character length (defaults to 500).
 */
export function sanitizeOrderText(
  input: unknown,
  maxLength: number = 500,
  options: { trim?: boolean } = {}
): string {
  if (typeof input !== "string") return "";
  const { trim = true } = options;

  let sanitized = input
    // 1. Unicode normalization (canonical composition)
    .normalize("NFC")
    // 2. Remove null bytes and non-printable control characters (preserve \r, \n, \t)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // 3. Remove directional formatting characters (bidi override attacks)
    .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "")
    // 4. Strip <script> and <style> tags and all their inner contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    // 5. Strip HTML tags starting with letters (preserves emoticons like "<3" or mathematical "< 5")
    .replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/gi, "")
    // 6. Normalize newlines and collapse excessive consecutive newlines to maximum 2
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    // 7. Enforce maximum length limit
    .slice(0, maxLength);

  return trim ? sanitized.trim() : sanitized;
}

