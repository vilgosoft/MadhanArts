import RS from 'react-slick';

type SliderCtor = typeof import('react-slick').default;

/**
 * Vite/Rolldown production bundles sometimes attach react-slick's class as
 * `module.default` while `import X from 'react-slick'` yields the wrapper
 * object — React then receives an object as element type (error #130).
 */
function resolveSlider(): SliderCtor {
  const mod = RS as unknown;
  if (typeof mod === 'function') {
    return mod as SliderCtor;
  }
  if (mod && typeof mod === 'object' && 'default' in mod) {
    const inner = (mod as { default: unknown }).default;
    if (typeof inner === 'function') {
      return inner as SliderCtor;
    }
  }
  return mod as SliderCtor;
}

const Slider = resolveSlider();
export default Slider;
