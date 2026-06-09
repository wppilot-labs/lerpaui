import { useState } from 'react';
import { useKeyboardShortcut } from './useKeyboardShortcut';

export function useCommandMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  // Monitor Command + K or Control + K
  useKeyboardShortcut('k', (e) => {
    e.preventDefault();
    toggle();
  }, {
    metaKey: true, // Cmd + K
    ignoreInputs: true,
  });

  useKeyboardShortcut('k', (e) => {
    e.preventDefault();
    toggle();
  }, {
    ctrlKey: true, // Ctrl + K
    ignoreInputs: true,
  });

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
}
