import type { CostCalculatorInput, CostCalculatorResult } from "../types/sandbox";

export const DEFAULT_VCPU_HOURLY_RATE = 0.032;
export const DEFAULT_RAM_GB_HOURLY_RATE = 0.0055;
export const DEFAULT_STORAGE_GB_MONTHLY_RATE = 0.1;

/**
 * Calculates monthly compute hours, RAM-hours, storage and estimated costs.
 */
export function calculateCost(input: CostCalculatorInput): CostCalculatorResult {
  const vCpu = Math.max(1, input.vCpu);
  const memoryGb = Math.max(0.5, input.memoryGb);
  const sandboxesCount = Math.max(1, input.sandboxesCount);
  const activeHoursPerDay = Math.min(24, Math.max(0, input.activeHoursPerDay));
  const activeDaysPerMonth = Math.min(31, Math.max(0, input.activeDaysPerMonth));
  const storageGb = Math.max(0, input.storageGb);

  const baseMonthlyHours = activeHoursPerDay * activeDaysPerMonth;
  const suspendReductionRatio = input.enableIdleSuspend
    ? Math.min(0.9, Math.max(0, input.idleSuspendPercentage / 100))
    : 0;
  const effectiveHoursPerSandbox = baseMonthlyHours * (1 - suspendReductionRatio);

  const monthlyComputeHoursTotal = baseMonthlyHours * sandboxesCount;
  const monthlyEffectiveHours = effectiveHoursPerSandbox * sandboxesCount;
  const monthlyCpuHours = monthlyEffectiveHours * vCpu;
  const monthlyRamGbHours = monthlyEffectiveHours * memoryGb;
  const monthlyStorageGbTotal = storageGb * sandboxesCount;

  const vCpuRate = input.customVcpuHourlyRate ?? DEFAULT_VCPU_HOURLY_RATE;
  const ramRate = input.customRamGbHourlyRate ?? DEFAULT_RAM_GB_HOURLY_RATE;
  const storageRate = input.customStorageGbMonthlyRate ?? DEFAULT_STORAGE_GB_MONTHLY_RATE;

  const computeCost = monthlyCpuHours * vCpuRate + monthlyRamGbHours * ramRate;
  const storageCost = monthlyStorageGbTotal * storageRate;
  const estimatedCostUsd = Number((computeCost + storageCost).toFixed(2));

  // Compute what it would cost without suspend
  const unreducedComputeHours = baseMonthlyHours * sandboxesCount;
  const unreducedComputeCost =
    unreducedComputeHours * vCpu * vCpuRate + unreducedComputeHours * memoryGb * ramRate;
  const unreducedTotal = unreducedComputeCost + storageCost;
  const savingsFromSuspendUsd = Number(Math.max(0, unreducedTotal - estimatedCostUsd).toFixed(2));

  const hourlyTotalUsd = Number((estimatedCostUsd / Math.max(1, baseMonthlyHours)).toFixed(4));

  // Provider estimates based on published or verified public rates
  // Note: Only transparent, publicly verified formulas are shown with isVerified: true
  const providerComparisons = [
    {
      providerName: "Custom Compute (Standard Cloud VPS)",
      estimatedCostUsd,
      isVerified: false,
      notes:
        "Based on baseline vCPU ($0.032/hr) + RAM ($0.0055/GB-hr) market benchmark, not a vendor rate.",
    },
    {
      providerName: "E2B (Firecracker MicroVMs)",
      estimatedCostUsd: null,
      isVerified: false,
      notes:
        "Pro is $150/month plus usage billed by the second, and the pricing page does not publish per-vCPU or per-GiB unit rates, so no estimate is claimed here.",
    },
    {
      providerName: "Modal Serverless Compute",
      estimatedCostUsd: Number(
        (
          monthlyCpuHours * 0.02358 +
          monthlyRamGbHours * 0.007992 +
          Math.max(0, monthlyStorageGbTotal - 1024) * 0.09
        ).toFixed(2),
      ),
      isVerified: true,
      notes:
        "Read 15 Nov 2026: $0.0000131 per core-second (a physical core is 2 vCPU), $0.00000222 per GiB-second, volumes $0.09/GiB-month after 1 TiB free. The 0.125-core minimum per container is not modelled.",
    },
    {
      providerName: "Fly.io Machines",
      estimatedCostUsd: null,
      isVerified: false,
      notes:
        "Billed per preset, not per vCPU: shared-cpu-1x 256MB is $0.0030/hour, performance-1x 2GB is $0.0458/hour. Preset sizes do not scale linearly with the inputs here, so no estimate is claimed.",
    },
    {
      providerName: "Self-Hosted Bare Metal (Dedicated)",
      estimatedCostUsd: Number((Math.ceil((sandboxesCount * vCpu) / 32) * 89.0).toFixed(2)),
      isVerified: false,
      notes:
        "Theoretical flat monthly cost for 32-core / 128GB RAM dedicated bare-metal server(s).",
    },
  ];

  return {
    monthlyComputeHoursTotal,
    monthlyEffectiveHours,
    monthlyCpuHours,
    monthlyRamGbHours,
    monthlyStorageGbTotal,
    estimatedCostUsd,
    hourlyTotalUsd,
    savingsFromSuspendUsd,
    providerComparisons,
  };
}
