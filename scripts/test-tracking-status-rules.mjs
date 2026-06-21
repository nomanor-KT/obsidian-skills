#!/usr/bin/env node

import test from "node:test";
import assert from "node:assert/strict";
import { deriveTimelineStatus } from "../server/trackingStatus.js";

function date(d) {
  return new Date(`${d}T10:00:00Z`);
}

test("booked when ETD and ETA are missing", () => {
  const status = deriveTimelineStatus({ eta: null, etd: null, today: date("2026-03-23") });
  assert.equal(status, "booked");
});

test("delivered_to_port before ETD", () => {
  const status = deriveTimelineStatus({
    eta: "2026-05-13",
    etd: "2026-05-05",
    today: date("2026-03-23"),
  });
  assert.equal(status, "delivered_to_port");
});

test("departed on ETD day", () => {
  const status = deriveTimelineStatus({
    eta: "2026-05-13",
    etd: "2026-05-05",
    today: date("2026-05-05"),
  });
  assert.equal(status, "departed");
});

test("in_transit between ETD and ETA", () => {
  const status = deriveTimelineStatus({
    eta: "2026-05-13",
    etd: "2026-05-05",
    today: date("2026-05-08"),
  });
  assert.equal(status, "in_transit");
});

test("arrived on ETA day", () => {
  const status = deriveTimelineStatus({
    eta: "2026-05-13",
    etd: "2026-05-05",
    today: date("2026-05-13"),
  });
  assert.equal(status, "arrived");
});

test("customs remains manual", () => {
  const status = deriveTimelineStatus({
    eta: "2026-05-13",
    etd: "2026-05-05",
    previousStatus: "customs",
    preserveManualCustoms: true,
    today: date("2026-05-08"),
  });
  assert.equal(status, "customs");
});

test("gone_out remains manual", () => {
  const status = deriveTimelineStatus({
    eta: "2026-05-13",
    etd: "2026-05-05",
    previousStatus: "gone_out",
    preserveManualGoneOut: true,
    today: date("2026-05-08"),
  });
  assert.equal(status, "gone_out");
});

test("stale gone_out without manual DEL flag is auto-corrected", () => {
  const status = deriveTimelineStatus({
    eta: "2026-04-15",
    etd: "2026-02-26",
    previousStatus: "gone_out",
    preserveManualGoneOut: false,
    today: date("2026-03-23"),
  });
  assert.equal(status, "in_transit");
});

test("stale customs without manual c/c flag is auto-corrected", () => {
  const status = deriveTimelineStatus({
    eta: "2026-04-15",
    etd: "2026-02-26",
    previousStatus: "customs",
    preserveManualCustoms: false,
    today: date("2026-03-23"),
  });
  assert.equal(status, "in_transit");
});
