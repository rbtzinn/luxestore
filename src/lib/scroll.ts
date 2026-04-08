let activeScrollFrame: number | null = null;

function syncScrollPosition(value: number) {
  window.scrollTo(0, value);
  document.documentElement.scrollTop = value;
  document.body.scrollTop = value;
}

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

export function animateScrollToTop(duration = 420) {
  const start = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

  if (activeScrollFrame) {
    window.cancelAnimationFrame(activeScrollFrame);
    activeScrollFrame = null;
  }

  if (start <= 0) {
    syncScrollPosition(0);
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    syncScrollPosition(0);
    return;
  }

  const startedAt = performance.now();

  const tick = (now: number) => {
    const elapsed = now - startedAt;
    const progress = Math.min(elapsed / duration, 1);
    const nextValue = Math.round(start * (1 - easeOutCubic(progress)));

    syncScrollPosition(nextValue);

    if (progress < 1) {
      activeScrollFrame = window.requestAnimationFrame(tick);
      return;
    }

    activeScrollFrame = null;
    syncScrollPosition(0);
  };

  activeScrollFrame = window.requestAnimationFrame(tick);
}
