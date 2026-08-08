import { CloudIcon, CloudCheckIcon, CloudWarningIcon, SyncIcon } from "@/components/ui";

interface CloudStatusIconProps {
  readonly signedIn: boolean;
  readonly syncing: boolean;
  readonly failed: boolean;
}

export function CloudStatusIcon({ signedIn, syncing, failed }: CloudStatusIconProps) {
  if (syncing) {
    return <SyncIcon size="md" className="animate-spin text-muted-foreground" />;
  }
  if (failed) {
    return <CloudWarningIcon size="md" className="text-warning" />;
  }
  if (signedIn) {
    return <CloudCheckIcon size="md" className="text-primary" />;
  }
  return <CloudIcon size="md" className="text-muted-foreground" />;
}
