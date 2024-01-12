"use client";

import { useEffect, useRef } from "react";

/** 
 * render an existing component without re-mounting.
 * 
 * # Example usage
 * 
 * ```tsx
 * export function MountSomExpensiveComp() {
 *   // create an element in a global state and portal the component to it
 *   // this is how regular createPortal works
 *   // you would put this in root layout for example
 *   const element = useStore.use.portalstuffElement();
 *   useEffect(() => {
 *     const el = document.createElement("div");
 *     el.setAttribute("style", "width:100%;height:100%;");
 *     setPortalstuffElement(el);
 *   }, []);
 * 
 *   if (!element) return null;
 *   return ReactDOM.createPortal(<SomExpensiveComp />, element);
 * }
 * 
 * export function DrawSomExpensiveComp() {
 *   // use this wherever you want to actually render the component
 *   const element = useStore.use.portalstuffElement();
 *   if (!element) return null;
 *   return <ReversePortal element={element} />;
 * }
 * ```

 */
export function ReversePortal({ element }: { element: HTMLDivElement }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentNode!;
    //parent.replaceChild(newChild, oldChild)
    parent.replaceChild(element, el);
  }, [element]);

  return <div ref={ref} />;
}

/**
 * render children into element
 *
 * later, you can render that same element with `<OutPortal element={element}/>`
 * where you actually want to draw it
 */
/*
export function InPortal({ element, children }: { element: HTMLDivElement; children: React.ReactNode }) {
  return createPortal(children, element);
}
*/

/*
export function useDivElement() {
  const [element, setElement] = useState<null | HTMLDivElement>(null);
  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("style", "width:100%;height:100%;");
    setElement(el);
  }, []);

  return element;
}
*/
