import { useEffect } from 'react';

export interface ShortcutOptions {
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  ignoreInputs?: boolean;
}

export function useKeyboardShortcut(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: ShortcutOptions = {}
) {
  const { metaKey, ctrlKey, altKey, shiftKey, ignoreInputs = true } = options;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (ignoreInputs) {
        const target = event.target as HTMLElement;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return;
        }
      }

      const matchKey = event.key.toLowerCase() === key.toLowerCase();
      const matchMeta = metaKey === undefined || event.metaKey === metaKey;
      const matchCtrl = ctrlKey === undefined || event.ctrlKey === ctrlKey;
      const matchAlt = altKey === undefined || event.altKey === altKey;
      const matchShift = shiftKey === undefined || event.shiftKey === shiftKey;

      if (matchKey && matchMeta && matchCtrl && matchAlt && matchShift) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, metaKey, ctrlKey, altKey, shiftKey, ignoreInputs]);
}
