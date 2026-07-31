import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 text-6xl font-bold text-muted-foreground/30">404</div>
      <h2 className="mb-2 text-lg font-semibold">Page not found</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover active:bg-primary-active"
      >
        Go home
      </Link>
    </div>
  );
}
