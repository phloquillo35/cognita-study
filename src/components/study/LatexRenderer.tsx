"use client";

import { useMemo } from "react";
import katex from "katex";

interface LatexRendererProps {
  content: string;
  className?: string;
}

function renderLatexSegment(text: string): string {
  try {
    return katex.renderToString(text, {
      throwOnError: false,
      displayMode: false,
    });
  } catch {
    return `<span class="text-[var(--destructive)]">${text}</span>`;
  }
}

function processContent(content: string): string {
  const parts: string[] = [];

  const displayPattern = /\$\$([\s\S]*?)\$\$/g;
  const inlinePattern = /\$([^\$\n]+?)\$/g;

  let processed = content;

  processed = processed.replace(displayPattern, (_match, latex: string) => {
    try {
      return katex.renderToString(latex.trim(), {
        throwOnError: false,
        displayMode: true,
      });
    } catch {
      return `<span class="text-[var(--destructive)]">${latex}</span>`;
    }
  });

  processed = processed.replace(inlinePattern, (_match, latex: string) => {
    return renderLatexSegment(latex.trim());
  });

  const paragraphs = processed.split(/\n\n+/);
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    const lines = trimmed.split("\n").join("<br/>");
    parts.push(`<p class="mb-3 leading-relaxed">${lines}</p>`);
  }

  return parts.join("");
}

export default function LatexRenderer({ content, className }: LatexRendererProps) {
  const html = useMemo(() => processContent(content), [content]);

  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
