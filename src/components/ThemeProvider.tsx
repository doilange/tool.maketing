"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps next-themes in a way that suppresses the React 19 "script tag"
 * console error in dev mode.  The error is harmless – next-themes injects a
 * tiny inline script to prevent FOUC, but React 19 warns about <script> inside
 * components.  Production builds are unaffected.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Suppress only the specific "Encountered a script tag" console.error in dev
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("Encountered a script tag while rendering React component")
      ) {
        return; // swallow this specific warning
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
