"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// On importe le type directement depuis "next-themes" sans le chemin /dist/types
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
