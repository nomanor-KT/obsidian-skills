import { SHIPMENT_OVERRIDES_KEY } from "../constants/index.js";

export const loadShipmentOverrides = () => {
  try {
    const raw = localStorage.getItem(SHIPMENT_OVERRIDES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const saveShipmentOverrides = (data) => {
  try {
    localStorage.setItem(SHIPMENT_OVERRIDES_KEY, JSON.stringify(data));
  } catch {
    // Ignore quota or serialization errors.
  }
};
