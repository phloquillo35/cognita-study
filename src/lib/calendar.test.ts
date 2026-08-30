import { describe, it, expect } from "vitest";
import { getMonthGrid, groupByDueDate, getDueForDate, getAvgRetention, buildCalendarDays, dayKey, filterBySubject, searchBySubject, toIcal } from "./calendar";
import type { Flashcard } from "@/types";

function makeCard(nextReview: string, overrides: Partial<Flashcard> = {}): Flashcard {
  return {
    id: crypto.randomUUID(),
    subjectId: "am1",
    front: "q",
    back: "a",
    difficulty: 5,
    nextReview: new Date(nextReview),
    reviewCount: 1,
    correctCount: 1,
    interval: 5,
    easeFactor: 2.5,
    repetitions: 1,
    createdAt: new Date(),
    stability: 5,
    lastReviewed: new Date("2026-08-29T00:00:00.000Z"),
    ...overrides,
  } as Flashcard;
}

describe("calendar getMonthGrid", () => {
  it("returns 42 days starting Monday", () => {
    const grid = getMonthGrid(2026, 7); // Aug 2026
    expect(grid).toHaveLength(42);
    // Aug 1 2026 is Saturday (getDay 6) -> Monday start should be July 27
    expect(dayKey(grid[0])).toBe("2026-07-27");
    expect(dayKey(grid[5])).toBe("2026-08-01");
  });
  it("covers 6 weeks", () => {
    const grid = getMonthGrid(2026, 0); // Jan 2026
    expect(grid[0].getDay()).toBe(1); // Monday
  });
});

describe("groupByDueDate", () => {
  it("groups cards by nextReview date", () => {
    const c1 = makeCard("2026-08-30T10:00:00.000Z");
    const c2 = makeCard("2026-08-30T15:00:00.000Z");
    const c3 = makeCard("2026-08-31T00:00:00.000Z");
    const map = groupByDueDate([c1, c2, c3]);
    expect(map.get("2026-08-30")).toHaveLength(2);
    expect(map.get("2026-08-31")).toHaveLength(1);
  });
});

describe("getDueForDate", () => {
  it("filters exact date", () => {
    const c1 = makeCard("2026-08-30T00:00:00.000Z");
    const c2 = makeCard("2026-08-31T00:00:00.000Z");
    expect(getDueForDate([c1, c2], new Date("2026-08-30"))).toHaveLength(1);
  });
});

describe("getAvgRetention", () => {
  it("returns null if no stability", () => {
    const c = makeCard("2026-08-30", { stability: undefined, lastReviewed: undefined });
    expect(getAvgRetention([c])).toBeNull();
  });
  it("returns retention 0-100 for due with stability", () => {
    const c = makeCard("2026-08-30", { stability: 10, lastReviewed: new Date() });
    const r = getAvgRetention([c], new Date());
    expect(r).toBeGreaterThanOrEqual(80);
    expect(r).toBeLessThanOrEqual(100);
  });
});

describe("buildCalendarDays", () => {
  it("marks today and current month", () => {
    const today = new Date("2026-08-30T12:00:00.000Z");
    const c = makeCard("2026-08-30T00:00:00.000Z");
    const days = buildCalendarDays([c], 2026, 7, today);
    const todayCell = days.find((d) => d.key === "2026-08-30")!;
    expect(todayCell.isToday).toBe(true);
    expect(todayCell.isCurrentMonth).toBe(true);
    expect(todayCell.due).toHaveLength(1);
    const nextMonth = days.find((d) => d.key === "2026-09-01")!;
    expect(nextMonth.isCurrentMonth).toBe(false);
  });
  it("avgRetention null when no due", () => {
    const days = buildCalendarDays([], 2026, 7, new Date("2026-08-30"));
    const cell = days.find((d) => d.key === "2026-08-30")!;
    expect(cell.avgRetention).toBeNull();
  });
});

describe("filterBySubject", () => {
  it("filters cards by subjectId", () => {
    const c1 = makeCard("2026-08-30T00:00:00.000Z", { subjectId: "am1" });
    const c2 = makeCard("2026-08-30T00:00:00.000Z", { subjectId: "aga" });
    const c3 = makeCard("2026-08-30T00:00:00.000Z", { subjectId: "am1" });
    expect(filterBySubject([c1, c2, c3], "am1")).toHaveLength(2);
    expect(filterBySubject([c1, c2, c3], "aga")).toHaveLength(1);
    expect(filterBySubject([c1, c2, c3], "all")).toHaveLength(3);
    expect(filterBySubject([c1, c2, c3], "")).toHaveLength(3);
  });
});

describe("searchBySubject", () => {
  it("searches case-insensitive substring on subjectId", () => {
    const c1 = makeCard("2026-08-30T00:00:00.000Z", { subjectId: "am1" });
    const c2 = makeCard("2026-08-30T00:00:00.000Z", { subjectId: "AM2" });
    const c3 = makeCard("2026-08-30T00:00:00.000Z", { subjectId: "fis1" });
    expect(searchBySubject([c1, c2, c3], "am")).toHaveLength(2);
    expect(searchBySubject([c1, c2, c3], "AM")).toHaveLength(2);
    expect(searchBySubject([c1, c2, c3], "")).toHaveLength(3);
    expect(searchBySubject([c1, c2, c3], "xyz")).toHaveLength(0);
  });
});

describe("toIcal", () => {
  it("generates VC calendar with BEGIN:VCALENDAR and DTSTART", () => {
    const c = makeCard("2026-08-30T00:00:00.000Z", { subjectId: "am1", front: "Derivada", back: "Definición de derivada" });
    const days = buildCalendarDays([c], 2026, 7, new Date("2026-08-30"));
    const ics = toIcal(days, "Cognita");
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("DTSTART;VALUE=DATE:20260830");
    expect(ics).toContain("SUMMARY:Derivada");
    expect(ics).toContain("X-WR-CALNAME:Cognita");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
  });
  it("handles empty days without VEVENT", () => {
    const days = buildCalendarDays([], 2026, 7, new Date("2026-08-30"));
    const ics = toIcal(days);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).not.toContain("BEGIN:VEVENT");
  });
});
