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

export function useResizeObserver(): [DOMRectReadOnly, (ref: any) => void] {
  const [contentBoxSize, setContentBoxSize] = useState<DOMRectReadOnly>(DOMRectReadOnly.fromRect())
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      setContentBoxSize(entry.target.getBoundingClientRect())
    }
  })
  const refCallback = useCallback((ref: any) => {
    if (ref === null) resizeObserver.disconnect()
    else resizeObserver.observe(ref)
  }, [])
  return [contentBoxSize, refCallback]
}
