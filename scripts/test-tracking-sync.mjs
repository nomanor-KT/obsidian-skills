#!/usr/bin/env node

const baseUrl = process.env.SEATRACK_API_BASE_URL || "http://localhost:8787";
const officeId = process.env.SEATRACK_TEST_OFFICE_ID || "PL";
const carrierCode = process.env.SEATRACK_TEST_CARRIER || "MAERSK";
const trackingRef = process.env.SEATRACK_TEST_TRACKING_REF || "MRKU3654755";

function fail(message, details = "") {
  console.error("FAIL:", message);
  if (details) console.error(details);
  process.exit(1);
}

async function callJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  return { response, body, text };
}

async function main() {
  const health = await callJson(`${baseUrl}/api/tracking/health`);
  if (!health.response.ok) {
    fail("Tracking health endpoint not reachable.", `${health.response.status} ${health.response.statusText}`);
  }

  const payload = {
    shipments: [
      {
        id: "TEST-MAERSK",
        officeId,
        status: "booked",
        carrierCode,
        trackingRef,
      },
    ],
  };

  const sync = await callJson(`${baseUrl}/api/tracking/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!sync.response.ok) {
    fail("Tracking sync request failed.", `${sync.response.status} ${sync.response.statusText}\n${sync.text}`);
  }

  const update = Array.isArray(sync.body?.updates) ? sync.body.updates[0] : null;
  if (!update) {
    fail("Missing update payload from tracking sync.", sync.text);
  }

  if (String(update.source || "").toLowerCase() !== "maersk") {
    fail("Unexpected adapter source.", `Expected maersk, got: ${update.source}`);
  }

  if (update.trackingSyncError) {
    fail("Tracking sync returned error.", String(update.trackingSyncError));
  }

  if (!String(update.trackingKey || "").trim()) {
    fail("Tracking key is empty.", sync.text);
  }

  console.log("PASS: tracking sync smoke test");
  console.log(`source=${update.source}`);
  console.log(`trackingKey=${update.trackingKey}`);
  console.log(`eta=${update.eta || ""}`);
  console.log(`etd=${update.etd || ""}`);
  console.log(`status=${update.status || ""}`);
}

main().catch((err) => {
  fail("Unhandled test error.", err?.stack || String(err));
});
