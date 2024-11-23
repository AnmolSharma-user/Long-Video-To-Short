"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

interface ClientProviderProps {
  children: React.ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration issues by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-32 w-32 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  );
}

// Utility function to check if we're on the client side
export const isClient = typeof window !== "undefined";

// Utility function to safely access window object
export function getWindow(): Window | undefined {
  if (isClient) {
    return window;
  }
  return undefined;
}

// Utility function to safely access document object
export function getDocument(): Document | undefined {
  if (isClient) {
    return document;
  }
  return undefined;
}

// Utility function to safely access localStorage
export function getLocalStorage(): Storage | undefined {
  if (isClient) {
    return localStorage;
  }
  return undefined;
}

// Utility function to safely access sessionStorage
export function getSessionStorage(): Storage | undefined {
  if (isClient) {
    return sessionStorage;
  }
  return undefined;
}

// Utility function to safely handle client-side effects
export function useClientEffect(effect: () => void | (() => void), deps: any[] = []) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      return effect();
    }
  }, [hasMounted, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps
}

// Utility function to safely handle client-side state
export function useClientState<T>(initialState: T | (() => T)) {
  const [state, setState] = useState<T>(initialState);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return [
    hasMounted ? state : (typeof initialState === "function" ? (initialState as () => T)() : initialState),
    setState,
  ] as const;
}

// Utility function to safely handle client-side refs
export function useClientRef<T>(initialValue: T | null = null) {
  const [hasMounted, setHasMounted] = useState(false);
  const ref = useState<T | null>(initialValue);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted ? ref : [initialValue, () => {}] as const;
}

// Utility function to safely handle client-side callbacks
export function useClientCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: any[] = []
) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    if (hasMounted) {
      return callback(...args);
    }
    return undefined;
  };
}