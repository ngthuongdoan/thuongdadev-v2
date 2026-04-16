import type { CSSProperties } from "react";

type WarpBackgroundProps = {
  className?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  scale?: number;
  rotation?: number;
  proportion?: number;
  softness?: number;
  distortion?: number;
  swirl?: number;
  swirlIterations?: number;
  shapeScale?: number;
};

const DEFAULT_STYLE: CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",
};

export default function WarpBackground({
  className = "",
  color1 = "#09090b",
  color2 = "#27272a",
  color3 = "#52525b",
  speed = 0.6,
  scale = 1,
  rotation = 0,
  proportion = 0.35,
  softness = 1,
  distortion = 0.25,
  swirl = 0.8,
  swirlIterations = 10,
  shapeScale = 0.3,
}: WarpBackgroundProps) {
  const intensity = Math.max(0.15, Math.min(1, softness));
  const blur = 80 + Math.round(distortion * 120);
  const duration = `${Math.max(12, 28 - speed * 10)}s`;
  const transform = `scale(${1 + shapeScale * 0.25 + (scale - 1) * 0.1}) rotate(${rotation * 180}deg)`;

  return (
    <div className={className} style={DEFAULT_STYLE}>
      <div
        style={{
          position: "absolute",
          inset: "-10%",
          background: `radial-gradient(circle at 18% 24%, ${color1} 0%, transparent 42%), radial-gradient(circle at 76% 18%, ${color2} 0%, transparent ${Math.round(
            34 + proportion * 20
          )}%), radial-gradient(circle at 62% 78%, ${color3} 0%, transparent 40%), linear-gradient(135deg, ${color1}, ${color2} 48%, ${color3})`,
          filter: `blur(${blur}px) saturate(${1 + swirl * 0.3})`,
          opacity: 0.65 + intensity * 0.15,
          transform,
          transformOrigin: "center",
          animation: `warpFloat ${duration} ease-in-out infinite alternate`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,${0.03 + distortion * 0.04}) 0%, transparent 26%), radial-gradient(circle at 70% 80%, rgba(255,255,255,${0.02 + swirlIterations * 0.002}) 0%, transparent 22%)`,
          mixBlendMode: "screen",
          opacity: 0.45,
        }}
      />
      <style>{`
        @keyframes warpFloat {
          0% {
            transform: ${transform} translate3d(-2%, -1%, 0);
          }
          100% {
            transform: ${transform} translate3d(${2 + swirl * 2}%, ${1 + proportion * 3}%, 0);
          }
        }
      `}</style>
    </div>
  );
}
