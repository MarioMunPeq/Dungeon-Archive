interface EmptyStateProps {
  readonly message: string;
  readonly action?: {
    readonly label: string;
    readonly onClick: () => void;
  };
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <p className="mb-4 text-sm text-muted-foreground">{message}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover active:bg-primary-active"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
