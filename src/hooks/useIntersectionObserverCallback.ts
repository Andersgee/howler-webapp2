import { type DependencyList, useEffect, useRef } from "react";

export function useIntersectionObserverCallback<T extends HTMLElement = HTMLDivElement>(
  callback: IntersectionObserverCallback,
  deps: DependencyList,
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    const observer = new IntersectionObserver(callback, options);
    if (node !== null) {
      observer.observe(node);
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
