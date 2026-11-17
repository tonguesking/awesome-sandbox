import type { Sandbox } from "../types/sandbox";

/**
 * A seat subscription sells a concurrent machine as part of a monthly plan.
 * Its zero-idle claim is real, but the unit is not comparable to a per-hour
 * postpaid bill, so every surface that prints an idle claim says which unit
 * the claim is priced in.
 */
export function seatBillingUnit(sandbox: Sandbox): string | null {
  const unit = sandbox.pricing.billingUnit?.trim();
  if (!unit || !/seat|user|member/i.test(unit)) {
    return null;
  }
  return unit;
}

export const SEAT_NOTE =
  "sold per seat, so the monthly plan bounds concurrency instead of metering hours";

export type BillingShape = "seat" | "self_hosted" | "software" | "metered" | "unpublished";

/**
 * Which family the published rate belongs to. Two listings in different
 * shapes cannot be compared by multiplying hours, which is the mistake a
 * side-by-side table invites.
 */
export function billingShape(sandbox: Sandbox): BillingShape {
  if (seatBillingUnit(sandbox)) {
    return "seat";
  }
  const unit = sandbox.pricing.billingUnit?.trim().toLowerCase() ?? "";
  if (/self-hosted|your own|local \(no charge\)|infrastructure hosting/.test(unit)) {
    return "self_hosted";
  }
  if (/open source|licen[cs]e/.test(unit)) {
    return "software";
  }
  if (unit && unit !== "not published") {
    return "metered";
  }
  return "unpublished";
}

export const BILLING_SHAPE_LABEL: Record<BillingShape, string> = {
  seat: "Per seat / month",
  self_hosted: "Runs on your machines",
  software: "Software licence only",
  metered: "Per-hour or per-second",
  unpublished: "Not published",
};
