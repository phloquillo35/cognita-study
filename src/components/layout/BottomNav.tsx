"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Brain,
  Target,
  FileQuestion,
  Clock,
  BookOpen,
  MessageCircle,
  CalendarDays,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", Icon: Home },
  { href: "/flashcards", label: "Flashcards", Icon: Brain },
  { href: "/practice", label: "Práctica", Icon: Target },
  { href: "/exam", label: "Examen", Icon: FileQuestion },
  { href: "/focus", label: "Enfoque", Icon: Clock },
  { href: "/notes", label: "Notas", Icon: BookOpen },
  { href: "/tutor", label: "Tutor", Icon: MessageCircle },
  { href: "/plan", label: "Plan", Icon: CalendarDays },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-stretch justify-between overflow-x-auto px-1 py-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`flex min-w-[3.75rem] flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium transition-colors ${
                active
                  ? "text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="whitespace-nowrap">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
