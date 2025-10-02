// Theme system removed - keep a minimal shim to avoid breaking imports during refactor
import React from "react"

export type Theme = "dark" | "light" | "system"

export type ThemeProviderProps = {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // No-op provider. Theme switching has been removed from the app.
  return <>{children}</>
}

export const useTheme = () => {
  // Return a stable interface in case some components still call this during migration.
  return {
    theme: "dark" as Theme,
    setTheme: (_: Theme) => {
      // no-op
    },
  }
}