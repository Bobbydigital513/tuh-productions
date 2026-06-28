"use client";

import { useInView } from "react-intersection-observer";

export function useScrollReveal(threshold = 0.2) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold });
  return { ref, inView };
}
