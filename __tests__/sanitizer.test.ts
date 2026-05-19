import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeHtml } from '../lib/security/sanitizer';

describe('OWASP Sanitization Module', () => {
  
  describe('sanitizeInput', () => {
    it('should strip clean simple text of all html tag formats', () => {
      const payload = '<script>alert("XSS")</script>Hello World';
      const clean = sanitizeInput(payload);
      expect(clean).toBe('Hello World');
    });

    it('should handle typical event triggers and delete attribute scripts', () => {
      const payload = '<img src="x" onerror="console.log(document.cookie)" />';
      const clean = sanitizeInput(payload);
      expect(clean).toBe('');
    });

    it('should preserve standard alphanumeric text inputs', () => {
      const payload = 'GenAISAP Quantum Node 01';
      const clean = sanitizeInput(payload);
      expect(clean).toBe('GenAISAP Quantum Node 01');
    });

    it('should return empty string for null or non-string inputs safely', () => {
      expect(sanitizeInput(null as any)).toBe('');
      expect(sanitizeInput(undefined as any)).toBe('');
    });
  });

  describe('sanitizeHtml', () => {
    it('should permit clean markdown-matching html elements like strong and anchors', () => {
      const payload = '<p>This is a <strong>glowing</strong> SAP node with <a href="https://sap.corp">Telemetry Link</a>.</p>';
      const clean = sanitizeHtml(payload);
      expect(clean).toContain('This is a <strong>glowing</strong>');
      expect(clean).toContain('<a href="https://sap.corp">Telemetry Link</a>');
    });

    it('should actively strip script tags from rich HTML formatting', () => {
      const payload = '<div><h3>Core FICO Analysis</h3><script>doMaliciousThing()</script></div>';
      const clean = sanitizeHtml(payload);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('doMaliciousThing');
    });
  });
});
