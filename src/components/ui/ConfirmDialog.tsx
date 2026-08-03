import { useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "./Button";
import { Inline } from "./Inline";
import { useDialog } from "./use-dialog";

interface ConfirmDialogProps {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel: string;
  readonly destructive: boolean;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
  readonly children?: ReactNode;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  destructive,
  onCancel,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useDialog({ onClose: onCancel, open: true, containerRef });

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
    >
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-card p-5 shadow-lg animate-slide-up">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {children}
        <p className="text-sm text-muted-foreground">{message}</p>
        <Inline gap="sm" className="w-full justify-end">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={destructive ? "danger-solid" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </Inline>
      </div>
    </div>
  );
}
