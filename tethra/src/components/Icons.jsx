// Tiny stroke-based icons so the app carries no icon dependency.
// All inherit currentColor.
const base = {
  width: 20, height: 20, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round",
};

export const IconHeart = (p) => (
  <svg {...base} {...p}><path d="M12 20s-7-4.5-9-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c-2 4.5-5 6.6-5 6.6" /><path d="M12 8l-1.5 1.5L12 11l1.5-1.5L12 8z" /></svg>
);
export const IconHome = (p) => (
  <svg {...base} {...p}><path d="M4 11l8-6 8 6" /><path d="M6 10v9h12v-9" /></svg>
);
export const IconMap = (p) => (
  <svg {...base} {...p}><path d="M9 4l6 2 5-2v14l-5 2-6-2-5 2V6l5-2z" /><path d="M9 4v14M15 6v14" /></svg>
);
export const IconUsers = (p) => (
  <svg {...base} {...p}><circle cx="8" cy="9" r="3" /><circle cx="17" cy="10" r="2.4" /><path d="M3 19c0-2.8 2.2-5 5-5s5 2.2 5 5" /><path d="M14.5 19c.3-2 1.6-3.4 3.5-3.4S21 16.9 21 19" /></svg>
);
export const IconCheck = (p) => (
  <svg {...base} {...p}><path d="M20 6L9 17l-5-5" /></svg>
);
export const IconCheckIn = (p) => (
  <svg {...base} {...p}><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 9h16M8 3v4M16 3v4" /><path d="M9 14l2 2 4-4" /></svg>
);
export const IconSettings = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="3" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" /></svg>
);
export const IconShield = (p) => (
  <svg {...base} {...p}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M12 9v3M12 9l-1 1 1 1 1-1-1-1z" /></svg>
);
export const IconLock = (p) => (
  <svg {...base} {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);
export const IconEye = (p) => (
  <svg {...base} {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="2.5" /></svg>
);
export const IconArrow = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const IconExit = (p) => (
  <svg {...base} width="14" height="14" {...p}><path d="M9 4H5v16h4" /><path d="M14 8l4 4-4 4M18 12H9" /></svg>
);
