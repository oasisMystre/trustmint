import { useEffect, useState } from "react";

export function useSize<T extends HTMLElement>(element: T | null | undefined) {
  const [size, setSize] = useState<[number, number]>([0, 0]);

  const onResize = () => {
    if (element) {
      const width = element.offsetWidth;
      const heigth = element.offsetHeight;
      
      setSize([width, heigth]);
    }
  };

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [element]);

  return size;
}
