"use client";

import { useEffect, useRef } from "react";

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export function useMountedRef() {
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef;
}

export function useInFlightRef() {
  return useRef(false);
}
