import { useEffect } from 'react';

/**
 * Universal hook to lock background scroll when any modal, form dialog, or drawer is open.
 * - Freezes both document.body and document.documentElement (<html>)
 * - Offsets scrollbar width to prevent layout shifts
 * - Intercepts non-passive wheel and touchmove events outside of modal content
 * - Restores original scroll positions cleanly on unmount / close
 */
export const useScrollLock = (isLocked = true) => {
  useEffect(() => {
    if (!isLocked) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    // 1. Lock both body and html containers and mark modal-open
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    // 2. Compensate scrollbar width to prevent page shift
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    // 3. Block wheel and touchmove events when cursor/touch is outside any active modal card
    const preventOuterScroll = (e) => {
      // Check if event originated inside any modal content, drawer, or dialog
      const targetElement = e.target;
      const insideModal = targetElement.closest(
        '.modal-content, .mobile-menu-drawer, .quickview-modal-content, .filter-drawer, [role="dialog"]'
      );

      // If user is hovering/interacting outside the active modal card, block default scrolling
      if (!insideModal) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventOuterScroll, { passive: false });
    window.addEventListener('touchmove', preventOuterScroll, { passive: false });

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.body.classList.remove('modal-open');
      window.removeEventListener('wheel', preventOuterScroll);
      window.removeEventListener('touchmove', preventOuterScroll);
    };
  }, [isLocked]);
};
