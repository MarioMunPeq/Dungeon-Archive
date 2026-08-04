import { createContext, useContext } from "react";

export type SnackbarTone = "default" | "success" | "error" | "warning" | "info";

export interface SnackbarAction {
  readonly label: string;
  readonly onPress: () => void;
}

export interface SnackbarOptions {
  readonly tone?: SnackbarTone;
  readonly action?: SnackbarAction;
  readonly durationMs?: number;
}

export interface SnackbarContextValue {
  readonly show: (message: string, options?: SnackbarOptions) => void;
}

export const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function useSnackbar(): SnackbarContextValue {
  const value = useContext(SnackbarContext);
  if (value === null) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return value;
}
