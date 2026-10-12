import { Skeleton } from "@/components/ui";
import { t } from "@/i18n";

export function BootScreen() {
  return (
    <div className="flex flex-col px-4 py-6">
      <div role="status" className="mb-6 space-y-1">
        <span className="sr-only">{t("boot.loading")}</span>
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-3 w-64" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
