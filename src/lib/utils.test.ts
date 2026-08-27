import { describe, it, expect } from "vitest";
import { cn, formatPercentage, getInitials } from "./utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("dedupes conflicting Tailwind classes (last wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles conditional falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});

describe("formatPercentage", () => {
  it("rounds to integer with %", () => {
    expect(formatPercentage(46)).toBe("46%");
    expect(formatPercentage(46.7)).toBe("47%");
  });
});

describe("getInitials", () => {
  it("returns up to two uppercase initials", () => {
    expect(getInitials("Ana García")).toBe("AG");
    expect(getInitials("juan")).toBe("J");
  });
});
