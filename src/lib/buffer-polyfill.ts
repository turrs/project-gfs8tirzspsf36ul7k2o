import { Buffer } from 'buffer';

// Make Buffer available globally for browser environment
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = window;
}

export { Buffer };