import { describe, expect, it } from "vitest";
import {
  computeStats,
  estimateEnergy,
  fmtEnergy,
  formatDistance,
  formatRange,
  type SessionEntry,
} from "../src/diesel-km.js";

describe("formatDistance", () => {
  it("uses readable units for tiny, meter, and kilometer distances", () => {
    expect(formatDistance({ min: 0.0005, max: 0.0005 })).toBe("0.5 mm");
    expect(formatDistance({ min: 0.42, max: 0.42 })).toBe("42 cm");
    expect(formatDistance({ min: 12.3, max: 12.3 })).toBe("12.3 m");
    expect(formatDistance({ min: 1234, max: 1234 })).toBe("1.234 km");
  });

  it("keeps meaningful ranges", () => {
    expect(formatDistance({ min: 1, max: 2 })).toBe("1.0 m–2.0 m");
  });
});

describe("formatters", () => {
  it("formats energy and parameter ranges", () => {
    expect(fmtEnergy({ min: 0.0000005, max: 0.0000005 })).toBe("0.5 µWh");
    expect(fmtEnergy({ min: 0.002, max: 0.002 })).toBe("2.00 mWh");
    expect(formatRange({ min: 7, max: 7 }, "B")).toBe("7B");
    expect(formatRange({ min: 1.5, max: 2 }, "B")).toBe("1.5–2B");
  });
});

describe("estimateEnergy", () => {
  it("falls back explicitly for unknown models", () => {
    const estimate = estimateEnergy(1200, "unknown-provider", "unknown-model");

    expect(estimate.energyKwh.min).toBeCloseTo(0.004729, 8);
    expect(estimate.energyKwh.max).toBeCloseTo(0.004729, 8);
    expect(estimate.meters.min).toBeCloseTo((0.004729 / 0.49) * 1000, 8);
    expect(estimate.source).toContain("fallback 2024 baseline");
  });
});

describe("computeStats", () => {
  it("aggregates assistant usage by model and ignores non-assistant messages", () => {
    const branch: SessionEntry[] = [
      {
        type: "message",
        message: {
          role: "user",
          usage: { input: 100, output: 999, totalTokens: 1099 },
        },
      },
      {
        type: "message",
        message: {
          role: "assistant",
          provider: "unknown-provider",
          model: "unknown-model",
          usage: { input: 1000, output: 1200, totalTokens: 2200 },
        },
      },
      {
        type: "message",
        message: {
          role: "assistant",
          provider: "unknown-provider",
          model: "unknown-model",
          usage: { input: 500, output: 0, totalTokens: 500 },
        },
      },
    ];

    const stats = computeStats(branch);

    expect(stats.totalInputTokens).toBe(1500);
    expect(stats.totalOutputTokens).toBe(1200);
    expect(stats.totalTokens).toBe(2700);
    expect(stats.totalEnergyKwh.min).toBeCloseTo(0.004729, 8);
    expect(stats.modelBreakdown).toHaveLength(1);
    expect(stats.modelBreakdown[0].outputTokens).toBe(1200);
    expect(stats.modelBreakdown[0].source).toContain("fallback 2024 baseline");
    expect(stats.contextInclusiveEnergyKwh.min).toBeGreaterThan(stats.totalEnergyKwh.min);
  });
});
