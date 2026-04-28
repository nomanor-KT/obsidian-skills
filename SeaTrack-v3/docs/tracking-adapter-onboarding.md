# Tracking Adapter Onboarding

This guide defines a repeatable way to add new carrier integrations.

## 1) Required Adapter Result Contract

Each adapter fetcher must return these fields:

- trackingKey: string or null
- eta: ISO date string or null
- etd: ISO date string or null
- status: non-empty string
- trackingSyncError: string or null

The backend enforces final normalization with normalizeTrackingAdapterResult(...), so adapter output can be partial, but these fields should still be provided explicitly.

## 2) Steps To Add A New Carrier

1. Add carrier code aliases as a Set constant in server/index.js.
2. Implement fetch<Carrier>TrackingUpdate(shipment).
3. Add one entry to TRACKING_ADAPTER_REGISTRY with:
   - source
   - carrierCodes
   - fetcher
4. Ensure adapter handles these cases:
   - missing credentials
   - missing lookup reference
   - unsupported carrier code for adapter
   - empty API response
   - API/rate-limit failure
5. Run manual sync once and confirm updates include:
   - source
   - trackingKey
   - eta/etd
   - status
   - trackingSyncError

## 3) Adapter Template

```js
const NEW_CARRIER_CODES = new Set(["NEWCARRIER", "NCRR"]);

function buildNewCarrierConfig() {
  return {
    apiKey: process.env.NEW_CARRIER_API_KEY || "",
    baseUrl: process.env.NEW_CARRIER_BASE_URL || "https://api.example.com",
  };
}

function getNewCarrierLookup(shipment) {
  const container = extractFirstContainerRef(shipment?.container);
  if (container) return { key: "container", value: container };
  if (shipment?.bl) return { key: "billOfLading", value: String(shipment.bl).trim() };
  if (shipment?.trackingRef) return { key: "reference", value: String(shipment.trackingRef).trim() };
  return null;
}

async function fetchNewCarrierTrackingUpdate(shipment) {
  const config = buildNewCarrierConfig();

  if (!config.apiKey) {
    return normalizeTrackingAdapterResult(shipment, {
      trackingKey: null,
      eta: parseIsoDate(shipment?.eta),
      etd: parseIsoDate(shipment?.etd),
      status: String(shipment?.status || "booked"),
      trackingSyncError: "NEW_CARRIER_API_KEY not configured.",
    });
  }

  const lookup = getNewCarrierLookup(shipment);
  if (!lookup) {
    return normalizeTrackingAdapterResult(shipment, {
      trackingKey: null,
      eta: parseIsoDate(shipment?.eta),
      etd: parseIsoDate(shipment?.etd),
      status: String(shipment?.status || "booked"),
      trackingSyncError: "Missing lookup reference (container/BL/trackingRef).",
    });
  }

  const code = String(shipment?.carrierCode || "").trim().toUpperCase();
  if (code && !NEW_CARRIER_CODES.has(code)) {
    return normalizeTrackingAdapterResult(shipment, {
      trackingKey: `${lookup.key}:${lookup.value}`,
      eta: parseIsoDate(shipment?.eta),
      etd: parseIsoDate(shipment?.etd),
      status: String(shipment?.status || "booked"),
      trackingSyncError: `Carrier ${code} not supported by NewCarrier adapter.`,
    });
  }

  const params = new URLSearchParams();
  params.set(lookup.key, lookup.value);

  const url = `${config.baseUrl.replace(/\/+$/, "")}/events?${params.toString()}`;
  const body = await fetchJson(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      Accept: "application/json",
    },
  });

  const beforeEta = parseIsoDate(shipment?.eta);
  const beforeEtd = parseIsoDate(shipment?.etd);
  const beforeStatus = String(shipment?.status || "booked");

  const events = Array.isArray(body?.events) ? body.events : [];
  const fromEvents = resolveMaerskDates(events);
  const mergedEta = pickNewerDate(beforeEta, fromEvents.eta);
  const mergedEtd = pickNewerDate(beforeEtd, fromEvents.etd);
  const status = deriveStatusFromMaerskEvents({ mergedEta, mergedEtd, shipment });

  return normalizeTrackingAdapterResult(shipment, {
    trackingKey: `${lookup.key}:${lookup.value}`,
    eta: mergedEta,
    etd: mergedEtd,
    status: status || beforeStatus,
    trackingSyncError: events.length ? null : "No events returned by NewCarrier API.",
  });
}
```

## 4) Registry Entry Template

```js
{
  source: "newcarrier",
  carrierCodes: NEW_CARRIER_CODES,
  fetcher: fetchNewCarrierTrackingUpdate,
}
```
