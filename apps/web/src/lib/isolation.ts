import type { Sandbox } from "../types/sandbox";

export type IsolationBoundary = "hardware" | "kernel" | "userspace" | "none" | "unknown";

const HARDWARE_SIGNAL =
  /firecracker|microvm|micro vm|kvm|kata|qemu|hypervisor|hyper-v|hyperv|hvf|whp|nitro|libkrun|hyperlight|virtualization\.framework|virtuali[sz]ed|virtual machine|\bvms?\b|full linux machine|nvx/;
const KERNEL_SIGNAL =
  /gvisor|container|docker|lxc|namespace|seccomp|bubblewrap|seatbelt|firejail|nsjail|sandboxie|landlock|wsl|kubernetes|\bpods?\b|kernel-enforced|policy kernel|host os isolation|process isolation|process sandbox/;
/** A tool can isolate a display, GUI session or browser profile without
 *  containing code. Those entries must not borrow the "kernel sandbox" label. */
const NO_BOUNDARY_SIGNAL = /not a sandbox|display isolation|no containment boundary/;

/**
 * What the workload is actually contained by, which is the question a runtime
 * list alone answers badly: "Docker" and "Firecracker" are both labels, but
 * only one of them is a hardware boundary. Unknown stays its own answer so a
 * listing without a documented backend is not promoted to the strongest tier.
 */
export function isolationBoundary(sandbox: Sandbox): IsolationBoundary {
  const otherItems = sandbox.runtime.other ?? [];
  const other = otherItems.join(" ").toLowerCase();
  // A backend the entry itself calls experimental is an option, not the
  // boundary a caller gets by default: MXC's microVM and Beam's VM dial must
  // not promote the listing into the hardware filter. A proposed or unshipped
  // tier counts the same way — it is a roadmap item, not a deliverable.
  const primary = otherItems
    .filter(
      (item) => !/experimental|opt-in|optional|proposed|planned|roadmap|not shipped/i.test(item),
    )
    .join(" ")
    .toLowerCase();
  const categories = sandbox.categories.join(" ").toLowerCase();
  const signals = `${primary} ${categories}`;

  if (
    sandbox.runtime.firecracker ||
    sandbox.productType === "microvm_hypervisor" ||
    signals.includes("microvm") ||
    signals.includes("micro vm") ||
    HARDWARE_SIGNAL.test(primary)
  ) {
    return "hardware";
  }

  if (NO_BOUNDARY_SIGNAL.test(primary)) {
    return "none";
  }

  // A wasm/interpreter core outranks an incidental "runs in Docker" note:
  // the bytes never reach the host kernel, so the boundary is the runtime.
  if (/wasm|webassembly|v8|isolate|interpreter|in-process/.test(other)) {
    return "userspace";
  }

  if (sandbox.runtime.gvisor || sandbox.runtime.docker || KERNEL_SIGNAL.test(other)) {
    return "kernel";
  }

  return "unknown";
}

export function matchesIsolationBoundary(sandbox: Sandbox, boundary: string): boolean {
  return isolationBoundary(sandbox) === boundary;
}

export const ISOLATION_BOUNDARY_LABEL: Record<IsolationBoundary, string> = {
  hardware: "Hardware VM",
  kernel: "Kernel sandbox",
  userspace: "Userspace runtime",
  none: "No containment boundary",
  unknown: "Not documented",
};
