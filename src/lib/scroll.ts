/**
 * Custom smooth scroll utility with cubic ease-in-out easing over ~700ms duration.
 * Properly accounts for sticky navbar offset (~72-80px) so section headers are never obscured.
 */

export function smoothScrollTo(targetY: number, duration: number = 750) {
  const startY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
  const distance = targetY - startY;

  if (Math.abs(distance) < 2) {
    window.scrollTo({ top: targetY });
    return;
  }

  const startTime = performance.now();

  // Ease-in-out cubic curve
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

/**
 * Smoothly scrolls to a DOM section element by ID with a navbar height offset.
 */
export function smoothScrollToSection(sectionId: string, offset: number = 76, duration: number = 750) {
  if (sectionId === 'home') {
    smoothScrollTo(0, duration);
    return;
  }

  const targetId = sectionId === 'booking' ? 'book' : sectionId;
  const el = document.getElementById(targetId) || (sectionId === 'book' ? document.getElementById('booking') : null);

  if (el) {
    const elementPosition = el.getBoundingClientRect().top + (window.pageYOffset || window.scrollY);
    const offsetPosition = Math.max(0, elementPosition - offset);
    smoothScrollTo(offsetPosition, duration);
  }
}
