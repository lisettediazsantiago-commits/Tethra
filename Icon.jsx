// Small standalone line icons used across a few screens (Comfort Map, Safety,
// Shared Space, Quick Exit). Each takes width/height and inherits currentColor.
import React from "react";

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Svg({ width = 16, height = 16, children, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height}
      style={{ display: "inline-block", verticalAlign: "-0.15em", flex: "none" }}
      aria-hidden="true" {...props}>
      <g {...base}>{children}</g>
    </svg>
  );
}

export function IconLock(props) {
  return (
    <Svg {...props}>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 15v2" />
    </Svg>
  );
}

export function IconHeart(props) {
  return (
    <Svg {...props}>
      <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z" />
    </Svg>
  );
}

export function IconEye(props) {
  return (
    <Svg {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

export function IconShield(props) {
  return (
    <Svg {...props}>
      <path d="M12 3 20 6v5c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6l8-3Z" />
    </Svg>
  );
}

export function IconExit(props) {
  return (
    <Svg {...props}>
      <path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
      <path d="M14 12H10" />
      <path d="m17 9 3 3-3 3" />
      <path d="M20 12h-6" />
    </Svg>
  );
}
