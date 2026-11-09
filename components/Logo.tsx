/**
 * AureVon mark — "From Noise to Signal" in one glyph.
 * An "A" whose left leg dissolves into noise fragments, a solid right leg,
 * and a single glowing signal point where the crossbar would be.
 * Strokes use currentColor so it follows the HUD's ink; the dot uses `dot`.
 */
export default function Logo({
  size = 22,
  dot = "var(--signal)",
  glow = true,
  className = "",
}: {
  size?: number;
  dot?: string;
  glow?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
      className={className}
    >
      {/* right leg: the signal, solid */}
      <path d="M16 3.5 L27.5 28.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      {/* left leg: solid at the apex, breaking into noise toward the ground */}
      <path d="M16 3.5 L11.4 13.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M9.7 17.2 L8.2 20.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" opacity=".7" />
      <path d="M6.6 24 L6 25.3" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" opacity=".45" />
      <circle cx="4.7" cy="28.4" r="1.15" fill="currentColor" opacity=".3" />
      {/* the one light source */}
      {glow && <circle cx="17.6" cy="19" r="5.2" fill={dot} opacity=".22" />}
      <circle cx="17.6" cy="19" r="2.5" fill={dot} />
    </svg>
  );
}
