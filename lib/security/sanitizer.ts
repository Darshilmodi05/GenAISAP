import DOMPurify from 'isomorphic-dompurify';

/**
 * OWASP-compliant input sanitization helpers.
 * Protects against XSS injection attacks.
 */

export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Standard text input purification (removes HTML tags and scripts entirely)
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  // Clean HTML rendering, allowing safe markdown elements but stripping risky script vectors
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'code', 'pre', 'span', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'class', 'rel']
  });
}
