function startOfDay(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

export function deriveTimelineStatus({
  eta,
  etd,
  previousStatus = "",
  preserveManualCustoms = false,
  preserveManualGoneOut = false,
  today = new Date(),
}) {
  const previous = String(previousStatus || "").trim();

  // Customs and gone_out are user-managed and should never be auto-overwritten.
  if ((previous === "customs" && preserveManualCustoms) || (previous === "gone_out" && preserveManualGoneOut)) {
    return previous;
  }

  const now = startOfDay(today);
  const etdDate = etd ? startOfDay(etd) : null;
  const etaDate = eta ? startOfDay(eta) : null;

  if (!etdDate && !etaDate) return "booked";
  if (etdDate && now && now < etdDate) return "delivered_to_port";
  if (etdDate && now && now.getTime() === etdDate.getTime()) return "departed";
  if (etaDate && now && now >= etaDate) return "arrived";
  if (etdDate && now && now > etdDate) return "in_transit";

  if (!etdDate && etaDate) {
    return now && now < etaDate ? "in_transit" : "arrived";
  }

  return previous || "booked";
}
