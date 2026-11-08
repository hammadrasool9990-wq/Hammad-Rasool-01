/** Fixed film grain + the shared SVG filter used for the RGB split on hover. */
export default function Atmosphere() {
  return (
    <>
      <div className="grain" aria-hidden />
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <filter id="rgb-split" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feOffset in="r" dx="-3" dy="0" result="r2" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb" />
          <feOffset in="gb" dx="3" dy="0" result="gb2" />
          <feBlend in="r2" in2="gb2" mode="screen" />
        </filter>
      </svg>
    </>
  );
}
