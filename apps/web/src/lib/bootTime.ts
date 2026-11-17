// Green implies a measured cold-start win. Unpublished, unknown or self-reported values read neutral.
export function isUnpublishedBootTime(value?: string) {
  if (!value) {
    return true;
  }
  const trimmed = value.trim();
  // A boot-time cell with no number in it cannot show a measured cold start. Some listings describe
  // the underlying mechanism ("container start time; no published figure") instead of saying
  // "not published", so treat any figure-free value as neutral rather than green.
  if (!/\d/.test(trimmed)) {
    return true;
  }
  return /^(not published|unknown|n\/a|none|vendor|site|self-reported)\b/i.test(trimmed);
}

// Vendor claims are not measured like the rest of the table. Keep them out of the cold-start ranking
// rather than letting a marketing number outrank an audited one.
export function isSelfReportedBootTime(value?: string) {
  return /self-report|vendor-report|project-report|vendor claim|per vendor|-reported\b/i.test(
    value ?? "",
  );
}

export function isMeasuredBootTime(value?: string) {
  return !(isUnpublishedBootTime(value) || isSelfReportedBootTime(value));
}
