import { useCallback, useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (window === undefined) {
      return false;
    }
    return matchMedia(query).matches;
  });

  useEffect(() => {
    const result = globalThis.matchMedia(query);
    setMatches(result.matches);
    const updater = ({ matches }: MediaQueryListEvent) => setMatches(matches);
    result.addEventListener("change", updater);
    return () => {
      result.removeEventListener("change", updater);
    };
  }, [query]);

  return matches;
}

export function useResizeObserver<T extends Element>(): [DOMRectReadOnly, T | null, (ref: T | null) => void] {
  const [contentRect, setContentRect] = useState<DOMRectReadOnly>(DOMRectReadOnly.fromRect())
  const [element, setElement] = useState<T | null>(null)
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      setContentRect(entry.contentRect)
      setElement(entry.target as T)
    }
  })
  const refCallback = useCallback((ref: T | null) => {
    if (ref === null) resizeObserver.disconnect()
    else resizeObserver.observe(ref)
  }, [])
  return [contentRect, element, refCallback]
}
