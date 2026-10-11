import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { useOptionalSnackbar } from "./snackbar-context";
import { CopyIcon } from "./icons";

interface CopyButtonProps {
  /** Plain text placed on the clipboard. */
  readonly text: string;
  readonly label: string;
  readonly copiedLabel: string;
  readonly className?: string;
}

/**
 * Small ghost button that copies `text` and confirms inline, falling back to a
 * snackbar when one is available.
 */
export function CopyButton({ text, label, copiedLabel, className }: CopyButtonProps) {
  const snackbar = useOptionalSnackbar();
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(() => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      snackbar?.show(copiedLabel, { tone: "success", durationMs: 2000 });
    };
    const fail = () => snackbar?.show(label, { tone: "error" });

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done, fail);
      return;
    }
    fail();
  }, [copiedLabel, label, snackbar, text]);

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? copiedLabel : label}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-control px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-95",
        className,
      )}
    >
      <CopyIcon size="xs" />
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}
