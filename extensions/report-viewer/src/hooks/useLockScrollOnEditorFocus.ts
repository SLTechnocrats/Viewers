import { useEffect } from 'react';

export default function useLockScrollOnEditorFocus(scrollContainerId: string = 'report-panel') {
  useEffect(() => {
    const scrollContainer = document.getElementById(scrollContainerId);
    if (!scrollContainer) return;

    let lastScrollTop = scrollContainer.scrollTop;

    // Keep scroll position saved
    const handleScroll = () => {
      lastScrollTop = scrollContainer.scrollTop;
    };
    scrollContainer.addEventListener('scroll', handleScroll);

    // Restore scroll whenever focus moves back into TinyMCE
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('.tox-tinymce') ||
        target.closest('.tox-edit-area') ||
        target.closest('iframe')
      ) {
        // Wait for TinyMCE focus scroll, then immediately revert
        requestAnimationFrame(() => {
          scrollContainer.scrollTop = lastScrollTop;
        });
      }
    };

    window.addEventListener('focusin', handleFocus);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('focusin', handleFocus);
    };
  }, [scrollContainerId]);
}
