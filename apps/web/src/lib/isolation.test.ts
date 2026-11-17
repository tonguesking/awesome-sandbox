import assert from "node:assert/strict";
import { test } from "vitest";
import { INITIAL_SANDBOXES } from "../data/sandboxes";
import { COLLECTED_SANDBOXES } from "../data/sandboxes-data";
import { isolationBoundary } from "./isolation";

const bySlug = (slug: string) => {
  const sandbox = INITIAL_SANDBOXES.find((item) => item.slug === slug);
  assert.ok(sandbox, `missing catalog entry ${slug}`);
  return sandbox;
};

test("isolation boundary classifies documented backends", () => {
  assert.equal(isolationBoundary(bySlug("e2b")), "hardware");
  // MXC's microVM backend is experimental and Windows-only; the default path
  // is an OS-native process sandbox, so it must not claim the hardware tier.
  assert.equal(isolationBoundary(bySlug("mxc")), "kernel");
  assert.equal(isolationBoundary(bySlug("monty")), "userspace");
  // Namespaces and seccomp share the host kernel; tagging this entry as a
  // microVM would promote it into the hardware filter it does not belong in.
  assert.equal(isolationBoundary(bySlug("nsjail")), "kernel");
  // Beam's default sandbox is a container; the VM is an opt-in dial, so the
  // hardware filter must not claim it.
  assert.equal(isolationBoundary(bySlug("beam")), "kernel");
  // A hidden desktop isolates the display, not the code: apps still run as the
  // user, so this must not be sold as a kernel sandbox.
  assert.equal(isolationBoundary(bySlug("agent-workspace-linux")), "none");
  // AgentJail's microVM tier is proposed, not shipped; the live boundary is
  // Seatbelt/Landlock, which is a kernel sandbox.
  assert.equal(isolationBoundary(bySlug("agentjail")), "kernel");
});

test("most hand-reviewed listings document a containment tier", () => {
  const collectedSlugs = new Set(COLLECTED_SANDBOXES.map((sandbox) => sandbox.slug));
  const curated = INITIAL_SANDBOXES.filter((sandbox) => !collectedSlugs.has(sandbox.slug));
  const documented = curated.filter((sandbox) => isolationBoundary(sandbox) !== "unknown");
  // Undocumented internals stay unknown rather than being guessed upward.
  assert.ok(
    documented.length / curated.length >= 0.85,
    `only ${documented.length}/${curated.length} curated listings documented`,
  );
});
