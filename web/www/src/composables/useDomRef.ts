import { useCallback, useState } from "react";

export const useDomRef = <T extends HTMLElement>() => {
  const [element, setElement] = useState<T>();
  const onChange = useCallback((node: T | null | undefined) => {
    if (node) setElement(node);
  }, []);
  return [element, onChange] as const;
};
