import { THEME } from "../../constants/index.js";

export const PinIcon = ({ filled }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "#C48A28" : "none"} stroke={filled ? "#C48A28" : THEME.border.strong} strokeWidth="2.5">
    <path d="M12 17v5"/>
    <path d="M9 11V4a1 1 0 011-1h4a1 1 0 011 1v7"/>
    <path d="M5 11h14l-1.5 6H6.5L5 11z"/>
  </svg>
);
