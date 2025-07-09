// This file provides a Buffer polyfill for the browser environment
import { Buffer as BufferPolyfill } from 'buffer';

// Make Buffer available globally
if (typeof window !== 'undefined') {
  (window as any).Buffer = BufferPolyfill;
}

export { BufferPolyfill as Buffer };