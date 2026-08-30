import type { Flashcard } from "@/types";
import { retrievability } from "@/lib/fsrs";
import { startOfDay, addDays, format, getDay, startOfMonth } from "date-fns";
import type { Locale } from "date-fns";

export interface CalendarDay {
  date: Date;
  key: string; // yyyy-MM-dd
  isCurrentMonth: boolean;
  isToday: boolean;
  due: Flashcard[];
  avgRetention: number | null; // 0-100 or null if no due with stability
}

export function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function getMonthGrid(year: number, month: number): Date[] {
  // month 0-11, weekStartsOn Monday (1)
  const first = startOfMonth(new Date(year, month, 1));
  const jsDay = getDay(first); // 0 Sun .. 6 Sat
  const offset = jsDay === 0 ? 6 : jsDay - 1; // Monday 0
  const gridStart = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

export function groupByDueDate(cards: Flashcard[]): Map<string, Flashcard[]> {
  const map = new Map<string, Flashcard[]>();
  for (const c of cards) {
    const key = dayKey(new Date(c.nextReview));
    const arr = map.get(key) ?? [];
    arr.push(c);
    map.set(key, arr);
  }
  return map;
}

export function getDueForDate(cards: Flashcard[], date: Date): Flashcard[] {
  const key = dayKey(date);
  return cards.filter((c) => dayKey(new Date(c.nextReview)) === key);
}

export function getAvgRetention(due: Flashcard[], asOf: Date = new Date()): number | null {
  const withStability = due.filter((c) => c.stability != null && c.lastReviewed);
  if (withStability.length === 0) return null;
  const sum = withStability.reduce((acc, c) => {
    const elapsed = Math.max(0, (asOf.getTime() - new Date(c.lastReviewed!).getTime()) / 86400000);
    return acc + retrievability(elapsed, c.stability!);
  }, 0);
  return Math.round((sum / withStability.length) * 100);
}

export function getRetentionColor(retention: number | null): string {
  if (retention == null) return "bg-[var(--muted)]";
  if (retention >= 80) return "bg-[var(--success)]";
  if (retention >= 60) return "bg-[var(--warning)]";
  return "bg-[var(--destructive)]";
}

export function buildCalendarDays(cards: Flashcard[], year: number, month: number, today = new Date()): CalendarDay[] {
  const grid = getMonthGrid(year, month);
  const map = groupByDueDate(cards);
  const todayKey = dayKey(startOfDay(today));
  return grid.map((date) => {
    const key = dayKey(date);
    const due = map.get(key) ?? [];
    return {
      date,
      key,
      isCurrentMonth: date.getMonth() === month,
      isToday: key === todayKey,
      due,
      avgRetention: getAvgRetention(due, today),
    };
  });
}

export function formatMonthYear(year: number, month: number, locale?: Locale): string {
  const d = new Date(year, month, 1);
  return locale ? format(d, "MMMM yyyy", { locale }) : format(d, "MMMM yyyy");
}

export function filterBySubject(cards: Flashcard[], subjectId: string): Flashcard[] {
  if (!subjectId || subjectId === "all") return cards;
  return cards.filter((c) => c.subjectId === subjectId);
}

export function searchBySubject(cards: Flashcard[], query: string): Flashcard[] {
  const q = query.trim().toLowerCase();
  if (!q) return cards;
  return cards.filter((c) => c.subjectId.toLowerCase().includes(q));
}

function escapeIcal(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

export function toIcal(days: CalendarDay[], calendarName = "Cognita"): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cognita//Calendar//EN",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${escapeIcal(calendarName)}`,
  ];
  const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  for (const day of days) {
    const dtstart = day.key.replace(/-/g, "");
    for (const card of day.due) {
      const uid = `${card.id}-${day.key}@cognita.app`;
      const summary = escapeIcal((card.front || card.subjectId).slice(0, 80));
      const description = escapeIcal(`${card.back.slice(0, 140)} - ${card.subjectId}`);
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${uid}`);
      lines.push(`DTSTAMP:${dtstamp}`);
      lines.push(`DTSTART;VALUE=DATE:${dtstart}`);
      lines.push(`SUMMARY:${summary}`);
      lines.push(`DESCRIPTION:${description}`);
      lines.push("END:VEVENT");
    }
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
