import { useState, useLayoutEffect } from 'react';

const BP_SM = 576;
const BP_MD = 768;
const BP_LG = 992;

export type CategoryCarouselLayout = {
  slidesToShow: number;
  slidesToScroll: number;
  autoplay: boolean;
  autoplaySpeed: number;
  /** Stable key so Slider can remount when crossing breakpoints */
  layoutKey: string;
};

/** When slidesToShow === slideCount, Slick has nowhere to move — arrows feel broken (common with 4/4 on laptop). */
function clampSlidesToShow(slidesToShow: number, itemCount: number): number {
  if (itemCount <= 1) return 1;
  if (slidesToShow >= itemCount) return Math.max(1, itemCount - 1);
  return slidesToShow;
}

function layoutForWidth(width: number, itemCount: number, autoplayMs: number): CategoryCarouselLayout {
  if (itemCount <= 0) {
    return {
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: autoplayMs,
      layoutKey: 'none',
    };
  }
  if (width <= BP_SM) {
    return {
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: itemCount > 1,
      autoplaySpeed: autoplayMs,
      layoutKey: 'xs',
    };
  }
  if (width <= BP_MD) {
    const raw = Math.min(2, itemCount);
    return {
      slidesToShow: clampSlidesToShow(raw, itemCount),
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: autoplayMs,
      layoutKey: 'sm',
    };
  }
  if (width <= BP_LG) {
    const raw = Math.min(3, itemCount);
    return {
      slidesToShow: clampSlidesToShow(raw, itemCount),
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: autoplayMs,
      layoutKey: 'md',
    };
  }
  const rawLg = Math.min(4, itemCount);
  return {
    slidesToShow: clampSlidesToShow(rawLg, itemCount),
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: autoplayMs,
    layoutKey: 'lg',
  };
}

/**
 * react-slick's built-in `responsive` option registers matchMedia listeners but does not
 * run handlers on first paint, so mobile often keeps desktop slidesToShow — arrows do nothing.
 */
export function useCategoryCarouselLayout(itemCount: number, autoplayMs: number): CategoryCarouselLayout {
  const [layout, setLayout] = useState<CategoryCarouselLayout>(() =>
    typeof window !== 'undefined'
      ? layoutForWidth(window.innerWidth, itemCount, autoplayMs)
      : layoutForWidth(1200, itemCount, autoplayMs)
  );

  useLayoutEffect(() => {
    const sync = () => setLayout(layoutForWidth(window.innerWidth, itemCount, autoplayMs));
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [itemCount, autoplayMs]);

  return layout;
}
