import assert from "node:assert/strict";
import { test } from "vitest";
import type { Sandbox } from "../types/sandbox";
import { billingShape, seatBillingUnit } from "./billing";

function makeSandbox(billingUnit?: string): Sandbox {
  return {
    id: "fixture",
    slug: "fixture",
    name: "Fixture",
    description: "fixture sandbox",
    logo: "FX",
    website: "https://example.com",
    productType: "commercial_saas",
    categories: ["AI Agent Sandbox"],
    runtime: {},
    deployment: { cloud: true, selfHosted: false, byoc: false },
    capabilities: {},
    pricing: { model: ["Subscription"], billingUnit },
    openSource: false,
    status: "active",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  };
}

test("seat-billed plans expose their unit", () => {
  assert.equal(seatBillingUnit(makeSandbox("seat / month")), "seat / month");
});

test("hourly and unset units are not treated as seat plans", () => {
  assert.equal(seatBillingUnit(makeSandbox("vCPU-hour")), null);
  assert.equal(seatBillingUnit(makeSandbox(undefined)), null);
  assert.equal(seatBillingUnit(makeSandbox("   ")), null);
});

test("rate shapes separate seat, self-hosted, licence and metered plans", () => {
  assert.equal(billingShape(makeSandbox("seat / month")), "seat");
  assert.equal(billingShape(makeSandbox("your own machine")), "self_hosted");
  assert.equal(billingShape(makeSandbox("infrastructure hosting only")), "self_hosted");
  assert.equal(billingShape(makeSandbox("open source software")), "software");
  assert.equal(billingShape(makeSandbox("vCPU-hour")), "metered");
  assert.equal(billingShape(makeSandbox("not published")), "unpublished");
  assert.equal(billingShape(makeSandbox(undefined)), "unpublished");
});
