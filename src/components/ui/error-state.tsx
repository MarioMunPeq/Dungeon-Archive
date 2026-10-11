import { Button } from "./Button";
import { t } from "@/i18n";

interface ErrorStateProps {
  readonly message: string;
  readonly onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center" role="alert">
      <p className="mb-2 text-sm font-medium text-destructive">{t("error.title")}</p>
      <p className="mb-4 text-xs text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          {t("error.retry")}
        </Button>
      )}
    </div>
  );
}