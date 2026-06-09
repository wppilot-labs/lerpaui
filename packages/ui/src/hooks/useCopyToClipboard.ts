import { useState, useCallback, useEffect } from 'react';

export function useCopyToClipboard(resetInterval = 2000) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      if ((globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('Clipboard not supported');
      }
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setCopied(true);
      return true;
    } catch (error) {
      if ((globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Failed to copy', error);
      }
      setCopiedText(null);
      setCopied(false);
      return false;
    }
  }, []);

  useEffect(() => {
    if (!copied) return;

    const timer = setTimeout(() => {
      setCopied(false);
    }, resetInterval);

    return () => clearTimeout(timer);
  }, [copied, resetInterval]);

  return { copied, copiedText, copy };
}
