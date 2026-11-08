import type { ReactNode } from "react";

export const isTodo = (s: string | null | undefined) => !!s && s.trim().startsWith("{{TODO");

/** Renders "{{TODO: …}}" strings as a visible dashed tag; everything else as-is. */
export function T({ children }: { children: string }): ReactNode {
  if (isTodo(children)) {
    return <span className="todo">{children.replace(/^\{\{\s*|\s*\}\}$/g, "")}</span>;
  }
  return children;
}
