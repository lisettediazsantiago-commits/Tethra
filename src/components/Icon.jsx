// AUTO-GENERATED from the Tethra icon library (63 icons).
// 24x24, line art on currentColor over a soft tinted circle.
//   <Icon name="affection" size={22} />        full icon (circle + art)
//   <Icon name="home" bare color="currentColor" />  line art only (for nav)
import React from "react";

// Custom Canva-designed icons (multi-color SVGs) live in ../assets/icons and
// override the line-art versions below for the same name. Loaded as URLs at
// build time; any name not present here falls through to the line-art set.
const _customUrls = import.meta.glob("../assets/icons/*.svg", { eager: true, query: "?url", import: "default" });
const CUSTOM = {};
for (const _p in _customUrls) {
  CUSTOM[_p.split("/").pop().replace(".svg", "")] = _customUrls[_p];
}

// Family tint behind each custom icon, pre-lightened to match the line icons'
// 0.68-opacity discs so the two styles sit together cleanly.
const CUSTOM_TINT = {
  connection: "#FBE8EB", empathy: "#FBE8EB", partner: "#FBE8EB", communication: "#FBE8EB",
  alignment: "#F1E7F6", healing: "#F1E7F6", reflection: "#F1E7F6", thoughts: "#F1E7F6",
  trust: "#F1E7F6", blueprint: "#F1E7F6", conversations: "#F1E7F6", milestone: "#F1E7F6",
  listen: "#F1E7F6",
  respect: "#E5EBE0", "trust-timeline": "#E5EBE0", growth: "#E5EBE0",
  "comfort-map": "#E5EBE0", progress: "#E5EBE0",
  clarity: "#FAEED8", understanding: "#FAEED8",
  write: "#F1F0F5", journal: "#F1F0F5",
  // batch 3 — the remaining visible icons
  intimacy: "#FBE8EB", affection: "#FBE8EB",
  home: "#F1E7F6", "shared-space": "#F1E7F6",
  "check-in": "#FAEED8", consent: "#FAEED8",
  settings: "#F1F0F5", "safety-resources": "#F1F0F5", privacy: "#F1F0F5",
};

const ICONS = {
"add-note": {
"c": "#7D7B87",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ECEAF1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v10\"/><path d=\"M7 12h10\"/></g>"
},
"affection": {
"c": "#C84F6B",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F9DDE2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z\"/><path d=\"M8 11h8\"/></g>"
},
"alignment": {
"c": "#6D4C7D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"9\" cy=\"12\" r=\"5\" opacity=\".35\" fill=\"currentColor\"/><circle cx=\"15\" cy=\"12\" r=\"5\" opacity=\".35\" fill=\"currentColor\"/></g>"
},
"appreciation": {
"c": "#C84F6B",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F9DDE2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3l2.8 5.7L21 9.6l-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9L7.5 14 3 9.6l6.2-.9L12 3Z\"/></g>"
},
"attachment": {
"c": "#C84F6B",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F9DDE2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 12a4 4 0 0 1 8 0v4a4 4 0 0 1-8 0V8a3 3 0 0 1 6 0v7\"/></g>"
},
"blueprint": {
"c": "#4B2E59",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"m8 13 3 3 6-8\"/><path d=\"M18 6l1.5-1.5\"/></g>"
},
"boundaries": {
"c": "#3F734D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#D9E3D1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3 20 7v5c0 5-3.4 8-8 9-4.6-1-8-4-8-9V7l8-4Z\"/><path d=\"M8 12h8\"/></g>"
},
"breathing": {
"c": "#3F734D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#D9E3D1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 12c-5-5 2-10 5-5s-3 7-5 5Z\"/><path d=\"M12 12c5 5-2 10-5 5s3-7 5-5Z\"/><path d=\"M12 12c-5 5-10-2-5-5s7 3 5 5Z\"/><path d=\"M12 12c5-5 10 2 5 5s-7-3-5-5Z\"/></g>"
},
"celebration": {
"c": "#C68F3C",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F7E7C6\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 21 9 9l6 6-10 6Z\"/><path d=\"M14 4h.01M18 7h.01M19 13h.01M10 3h.01\"/><path d=\"M15 5l3-3\"/></g>"
},
"check-in": {
"c": "#C68F3C",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F7E7C6\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12a8 8 0 1 1 3.2 6.4L4 21l.8-4A8 8 0 0 1 4 12Z\"/><path d=\"m8 12 3 3 5-6\"/></g>"
},
"clarity": {
"c": "#C68F3C",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F7E7C6\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2\"/><path d=\"M12 20v2\"/><path d=\"M4 4l1.5 1.5\"/><path d=\"M18.5 18.5 20 20\"/><path d=\"M2 12h2\"/><path d=\"M20 12h2\"/><path d=\"M4 20l1.5-1.5\"/><path d=\"M18.5 5.5 20 4\"/></g>"
},
"comfort-map": {
"c": "#3F734D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#D9E3D1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 5.5v14l5-2.5 6 2.5 5-2.5v-14l-5 2.5-6-2.5-5 2.5Z\"/><path d=\"M9 3v14\"/><path d=\"M15 5.5v14\"/></g>"
},
"communication": {
"c": "#C84F6B",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F9DDE2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 18a7 7 0 1 1 3.2 2.1L4 21l1-3Z\"/><path d=\"M12 15s-4-2.6-4-5a2.2 2.2 0 0 1 4-1.3A2.2 2.2 0 0 1 16 10c0 2.4-4 5-4 5Z\"/></g>"
},
"compatibility": {
"c": "#6D4C7D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 8h10\"/><path d=\"M7 16h10\"/><path d=\"M9 6v4\"/><path d=\"M15 14v4\"/><circle cx=\"9\" cy=\"8\" r=\"2\"/><circle cx=\"15\" cy=\"16\" r=\"2\"/></g>"
},
"complete": {
"c": "#3F734D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#D9E3D1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m8 12 3 3 5-6\"/></g>"
},
"conflict": {
"c": "#7D7B87",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ECEAF1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 4 20 20\"/><path d=\"M20 4 4 20\"/><path d=\"M7 4h10\"/><path d=\"M7 20h10\"/></g>"
},
"connection-score": {
"c": "#6D4C7D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M8 13h8\"/><path d=\"M8 17h5\"/><path d=\"M9 8s-2-1.4-2-3c1.4 0 2 .9 2 2 0-1.1.6-2 2-2 0 1.6-2 3-2 3Z\"/></g>"
},
"connection": {
"c": "#C84F6B",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F9DDE2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20.5 8.5c0 6-8.5 11-8.5 11s-8.5-5-8.5-11A4.7 4.7 0 0 1 12 5a4.7 4.7 0 0 1 8.5 3.5Z\"/></g>"
},
"consent": {
"c": "#C68F3C",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F7E7C6\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 12h10\"/><path d=\"M12 7v10\"/><path d=\"M4 4h16v16H4z\"/></g>"
},
"conversations": {
"c": "#6D4C7D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 6h11a3 3 0 0 1 3 3v5H9l-5 4V9a3 3 0 0 1 3-3Z\"/><path d=\"M9 14v2a3 3 0 0 0 3 3h3l5 3v-9a3 3 0 0 0-2-2.8\"/><path d=\"M8 10h.01M12 10h.01M16 10h.01\"/></g>"
},
"curiosity": {
"c": "#C68F3C",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F7E7C6\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 19h.01\"/><path d=\"M9 8a3 3 0 1 1 5 2.2c-1.2.9-2 1.7-2 3.8\"/><circle cx=\"12\" cy=\"12\" r=\"9\"/></g>"
},
"edit": {
"c": "#7D7B87",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ECEAF1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m4 20 4-1 11-11a2.8 2.8 0 0 0-4-4L4 15l-1 4Z\"/><path d=\"m14 5 5 5\"/></g>"
},
"emotional-safety": {
"c": "#3F734D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#D9E3D1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 21s-8-4-8-10V6l8-3 8 3v5c0 6-8 10-8 10Z\"/><path d=\"M12 15s-4-2.4-4-5a2.3 2.3 0 0 1 4-1.4A2.3 2.3 0 0 1 16 10c0 2.6-4 5-4 5Z\"/></g>"
},
"empathy": {
"c": "#C84F6B",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F9DDE2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 21s-7-3-7-8V8l7-5 7 5v5c0 5-7 8-7 8Z\"/><path d=\"M12 8s-3-2-3-4c1.8 0 3 1.2 3 3 0-1.8 1.2-3 3-3 0 2-3 4-3 4Z\"/><path d=\"M8 13c1 1.5 2.2 2.5 4 3.5 1.8-1 3-2 4-3.5\"/></g>"
},
"energy": {
"c": "#C68F3C",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F7E7C6\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M13 2 5 14h6l-1 8 9-13h-6l1-7Z\"/></g>"
},
"gentle-reminder": {
"c": "#7D7B87",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ECEAF1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16l-2-2Z\"/><path d=\"M9 21h6\"/><path d=\"M12 3c1-1 2-1 3 0\"/></g>"
},
"goals": {
"c": "#C68F3C",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F7E7C6\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"5\"/><path d=\"M12 12 20 4\"/><path d=\"M17 4h3v3\"/></g>"
},
"gratitude": {
"c": "#C84F6B",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F9DDE2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 21s-8-4-8-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 11c0 6-8 10-8 10Z\"/><path d=\"M12 8v8M8 12h8\"/></g>"
},
"growth": {
"c": "#3F734D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#D9E3D1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 21V10\"/><path d=\"M12 14c-4 0-7-3-7-7 4 0 7 3 7 7Z\"/><path d=\"M12 12c4 0 7-3 7-7-4 0-7 3-7 7Z\"/><path d=\"M5 21h14\"/></g>"
},
"healing": {
"c": "#6D4C7D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 20c-4-3-7-6-7-10a7 7 0 0 1 14 0c0 4-3 7-7 10Z\"/><path d=\"M7 12h10\"/><path d=\"M12 7v10\"/></g>"
},
"help": {
"c": "#C68F3C",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F7E7C6\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.5 9a2.8 2.8 0 0 1 5 1.8c0 2-2.5 2.4-2.5 4.2\"/><path d=\"M12 18h.01\"/></g>"
},
"history": {
"c": "#7D7B87",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ECEAF1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v6l4 2\"/></g>"
},
"home": {
"c": "#4B2E59",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 10.5 12 3l9 7.5\"/><path d=\"M5 9.5V21h5v-6h4v6h5V9.5\"/></g>"
},
"insights": {
"c": "#C68F3C",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F7E7C6\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3v3\"/><path d=\"M12 18v3\"/><path d=\"M3 12h3\"/><path d=\"M18 12h3\"/><path d=\"m6.5 6.5 2.1 2.1\"/><path d=\"m15.4 15.4 2.1 2.1\"/><path d=\"m17.5 6.5-2.1 2.1\"/><path d=\"m8.6 15.4-2.1 2.1\"/></g>"
},
"intimacy": {
"c": "#C84F6B",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F9DDE2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 12c-2-2-2-5 0-7 2 0 4 1 4 3 0-2 2-3 4-3 2 2 2 5 0 7l-4 4-4-4Z\"/><path d=\"M6 20h12\"/></g>"
},
"invitations": {
"c": "#6D4C7D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"4\" y=\"6\" width=\"16\" height=\"12\" rx=\"2\"/><path d=\"m4 8 8 6 8-6\"/></g>"
},
"journal": {
"c": "#7D7B87",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ECEAF1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 5.5A3.5 3.5 0 0 1 7.5 4H20v16H7.5A3.5 3.5 0 0 0 4 21.5v-16Z\"/><path d=\"M4 5.5A3.5 3.5 0 0 0 7.5 7H20\"/></g>"
},
"listen": {
"c": "#6D4C7D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 18c0 2 1.5 3 3 3 2 0 3-1.5 3-3 0-3 4-4 4-9a7 7 0 1 0-14 0\"/><path d=\"M9 9a3 3 0 1 1 6 0c0 2-2 3-2 5\"/></g>"
},
"milestone": {
"c": "#6D4C7D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"2.2\"/><path d=\"M12 4c2.5 2.5 2.5 5.5 0 8-2.5-2.5-2.5-5.5 0-8Z\"/><path d=\"M12 20c-2.5-2.5-2.5-5.5 0-8 2.5 2.5 2.5 5.5 0 8Z\"/><path d=\"M4 12c2.5-2.5 5.5-2.5 8 0-2.5 2.5-5.5 2.5-8 0Z\"/><path d=\"M20 12c-2.5 2.5-5.5 2.5-8 0 2.5-2.5 5.5-2.5 8 0Z\"/></g>"
},
"more": {
"c": "#7D7B87",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ECEAF1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M8 12h.01M12 12h.01M16 12h.01\"/></g>"
},
"notifications": {
"c": "#7D7B87",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ECEAF1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16l-2-2Z\"/><path d=\"M10 20a2 2 0 0 0 4 0\"/><path d=\"M12 3V2\"/></g>"
},
"partner": {
"c": "#C84F6B",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F9DDE2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"8\" cy=\"10\" r=\"3\"/><circle cx=\"16\" cy=\"10\" r=\"3\"/><path d=\"M3 21c.5-3 2.2-5 5-5s4.5 2 5 5\"/><path d=\"M11 21c.5-3 2.2-5 5-5s4.5 2 5 5\"/><path d=\"M16 6s-2-1.3-2-3c1.1 0 2 .9 2 2 0-1.1.9-2 2-2 0 1.7-2 3-2 3Z\"/></g>"
},
"pause": {
"c": "#3F734D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#D9E3D1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9 8v8M15 8v8\"/></g>"
},
"privacy": {
"c": "#7D7B87",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ECEAF1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"10\" width=\"14\" height=\"11\" rx=\"2\"/><path d=\"M8 10V7a4 4 0 0 1 8 0v3\"/><path d=\"M12 15v2\"/></g>"
},
"profile": {
"c": "#4B2E59",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"8\" r=\"3.5\"/><path d=\"M5 21a7 7 0 0 1 14 0\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/></g>"
},
"progress-circle": {
"c": "#3F734D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#D9E3D1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3a9 9 0 1 1-8.5 6\"/><path d=\"M12 3a9 9 0 0 1 9 9\"/><text x=\"12\" y=\"15\" font-size=\"5\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\">75%</text></g>"
},
"progress": {
"c": "#3F734D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#D9E3D1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 20C8 13 12 8 19 4\"/><path d=\"M9 14c-3 0-5-2-5-5 3 0 5 2 5 5Z\"/><path d=\"M14 10c-3 0-5-2-5-5 3 0 5 2 5 5Z\"/><path d=\"M18 7c-2 0-3.5-1.5-3.5-3.5 2 0 3.5 1.5 3.5 3.5Z\"/></g>"
},
"reflection": {
"c": "#4B2E59",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"4\" y=\"5\" width=\"16\" height=\"16\" rx=\"3\"/><path d=\"M8 3v4\"/><path d=\"M16 3v4\"/><path d=\"M4 10h16\"/><path d=\"m8 15 3 3 5-6\"/></g>"
},
"repair": {
"c": "#6D4C7D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 7a7 7 0 0 1 10 10\"/><path d=\"M17 7v4h-4\"/><path d=\"M17 17a7 7 0 0 1-10-10\"/><path d=\"M7 17v-4h4\"/></g>"
},
"reset": {
"c": "#7D7B87",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ECEAF1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12a8 8 0 1 0 2.3-5.7L4 8.5\"/><path d=\"M4 4v4.5h4.5\"/></g>"
},
"respect": {
"c": "#3F734D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#D9E3D1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20.5 8.5c0 6-8.5 11-8.5 11s-8.5-5-8.5-11A4.7 4.7 0 0 1 12 5a4.7 4.7 0 0 1 8.5 3.5Z\"/></g>"
},
"safety-resources": {
"c": "#7D7B87",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ECEAF1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3 20 6v5c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6l8-3Z\"/></g>"
},
"saved": {
"c": "#7D7B87",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ECEAF1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 4h12v17l-6-4-6 4V4Z\"/></g>"
},
"schedule": {
"c": "#7D7B87",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ECEAF1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"4\" y=\"5\" width=\"16\" height=\"16\" rx=\"3\"/><path d=\"M8 3v4M16 3v4M4 10h16\"/></g>"
},
"settings": {
"c": "#7D7B87",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ECEAF1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z\"/><path d=\"M4 12a8 8 0 0 1 .2-1.8L2.5 8.8l2-3.5 2.2.8A8 8 0 0 1 9 4.8L9.4 2h5.2l.4 2.8a8 8 0 0 1 2.3 1.3l2.2-.8 2 3.5-1.7 1.4a8 8 0 0 1 0 3.6l1.7 1.4-2 3.5-2.2-.8A8 8 0 0 1 15 19.2l-.4 2.8H9.4L9 19.2a8 8 0 0 1-2.3-1.3l-2.2.8-2-3.5 1.7-1.4A8 8 0 0 1 4 12Z\"/></g>"
},
"shared-goals": {
"c": "#6D4C7D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 20c4-8 12-8 16 0\"/><path d=\"M12 4v9\"/><path d=\"m12 4 6 4-6 4\"/></g>"
},
"shared-space": {
"c": "#6D4C7D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"8\" cy=\"8\" r=\"3\"/><circle cx=\"16\" cy=\"8\" r=\"3\"/><path d=\"M3 20c.6-3 2.5-5 5-5s4.4 2 5 5\"/><path d=\"M11 20c.6-3 2.5-5 5-5s4.4 2 5 5\"/></g>"
},
"thoughts": {
"c": "#4B2E59",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 17h8a5 5 0 0 0 0-10 6 6 0 0 0-11 3 4 4 0 0 0 3 7Z\"/><circle cx=\"5\" cy=\"20\" r=\"1\"/><circle cx=\"2.5\" cy=\"22\" r=\".7\"/></g>"
},
"trust-timeline": {
"c": "#3F734D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#D9E3D1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 21V8\"/><path d=\"M12 8c-3 0-5-2-5-5 3 0 5 2 5 5Z\"/><path d=\"M12 10c3 0 5-2 5-5-3 0-5 2-5 5Z\"/><path d=\"M7 15h10\"/><path d=\"M5 21h14\"/></g>"
},
"trust": {
"c": "#6D4C7D",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#EADCF2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8.5 12.5 6 10a2.1 2.1 0 0 0-3 3l5 5c1.2 1.2 3.2 1.2 4.4 0L21 9.5a2.1 2.1 0 0 0-3-3l-6.5 6.5\"/><path d=\"M12 13 9 10a2.1 2.1 0 0 1 3-3l2 2\"/></g>"
},
"understanding": {
"c": "#C68F3C",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F7E7C6\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 21h6\"/><path d=\"M10 17h4\"/><path d=\"M8 14a6 6 0 1 1 8 0c-1 1-1.5 2-1.5 3h-5c0-1-.5-2-1.5-3Z\"/><path d=\"M12 2v2M4 5l1.5 1.5M20 5l-1.5 1.5\"/></g>"
},
"vulnerability": {
"c": "#C84F6B",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#F9DDE2\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3v18\"/><path d=\"M5 9c4 0 7 3 7 7-4 0-7-3-7-7Z\"/><path d=\"M19 9c-4 0-7 3-7 7 4 0 7-3 7-7Z\"/></g>"
},
"write": {
"c": "#7D7B87",
"bg": "<circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ECEAF1\" opacity=\"0.68\"/>",
"art": "<g stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m4 20 4-1 10-10a2.8 2.8 0 0 0-4-4L4 15l-1 4Z\"/><path d=\"m13 6 4 4\"/><path d=\"M4 22c4-2 8 1 12-1\"/></g>"
}
};

export const ICON_NAMES = Object.keys(ICONS);

export default function Icon({ name, size = 22, color, bare = false, title, className, style }) {
  // Custom multi-color icons. In `bare` mode (bottom nav) we render just the
  // art with no tinted disc, sized to the icon box — the nav marks the active
  // tab with a dot under the label rather than recoloring the icon.
  const customSrc = CUSTOM[name];
  if (customSrc) {
    if (bare) {
      return (
        <span className={className} role={title ? "img" : undefined} aria-label={title}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
                   width: size, height: size, flex: "none", ...style }}>
          <img src={customSrc} width={size} height={size} alt={title || ""}
            aria-hidden={title ? undefined : true} draggable={false} style={{ display: "block" }} />
        </span>
      );
    }
    const artSize = Math.round(size * 0.76);
    return (
      <span className={className} role={title ? "img" : undefined} aria-label={title}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: size, height: size, borderRadius: "50%", flex: "none",
          background: CUSTOM_TINT[name] || "#F1E7F6", ...style,
        }}>
        <img src={customSrc} width={artSize} height={artSize} alt={title || ""}
          aria-hidden={title ? undefined : true} draggable={false}
          style={{ display: "block" }} />
      </span>
    );
  }
  const ic = ICONS[name];
  if (!ic) { if (typeof console !== "undefined") console.warn("Icon: unknown name '" + name + "'"); return null; }
  const inner = (title ? "<title>" + title + "</title>" : "") + (bare ? "" : ic.bg) + ic.art;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}
      role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}
      className={className}
      style={{ color: color || ic.c, display: "inline-block", flex: "none", ...style }}
      dangerouslySetInnerHTML={{ __html: inner }} />
  );
}
