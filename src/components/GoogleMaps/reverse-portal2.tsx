import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Options = {
  attributes: Record<string, string>;
};

type PortalNode = ReturnType<typeof createPortalNode>;
export const createPortalNode = (options?: Options) => {
  const element = document.createElement("div");
  if (options) {
    for (const [key, value] of Object.entries(options.attributes)) {
      element.setAttribute(key, value);
    }
  }
  let parent: HTMLDivElement | undefined;
  let lastPlaceholder: HTMLDivElement | undefined;

  const portalNode = {
    element,
    mount: (newParent: HTMLDivElement, newPlaceholder: HTMLDivElement) => {
      if (newPlaceholder === lastPlaceholder) {
        return;
      }
      portalNode.unmount();
      newParent.replaceChild(portalNode.element, newPlaceholder);
      parent = newParent;
      lastPlaceholder = newPlaceholder;
    },
    unmount: (expectedPlaceholder?: HTMLDivElement) => {
      if (expectedPlaceholder && expectedPlaceholder !== lastPlaceholder) {
        return;
      }
      if (parent && lastPlaceholder) {
        parent.replaceChild(lastPlaceholder, portalNode.element);
        parent = undefined;
        lastPlaceholder = undefined;
      }
    },
  };
  return portalNode;
};

function usePortalNode() {
  const [portalNode, setPortalNode] = useState<null | PortalNode>(null);
  useEffect(() => {
    const node = createPortalNode({ attributes: { style: "width:100%;height:100%;" } });
    setPortalNode(node);
  }, []);

  return portalNode;
}

/**
 * render children into portalNode
 *
 * later, you can render that same portalNode with `<OutPortal>` where you need it
 */
function InPortal({ portalNode, children }: { portalNode: HTMLDivElement; children: React.ReactNode }) {
  return createPortal(children, portalNode);
}

function OutPortal({ portalNode }: { portalNode: PortalNode }) {
  const ref = useCallback(
    (node: HTMLDivElement) => {
      if (node !== null) {
        console.log("OutPortal, replacing child...");
        const parent = node.parentNode!;
        const newChild = portalNode.element;
        const oldChild = node;
        parent.replaceChild(newChild, oldChild);
        //portalNode.mount(node)
      } else {
        console.log("OutPortal, no node");
        //portalNode.unmount(node)
      }
    },
    [portalNode]
  );

  return <div ref={ref} />;
}
