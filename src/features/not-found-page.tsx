import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { t } from "@/i18n";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        404
      </div>
      <h2 className="mb-2 text-lg font-semibold">{t("notFound.title")}</h2>
      <p className="mb-6 text-sm text-muted-foreground">{t("notFound.body")}</p>
      <Link to="/">
        <Button>{t("notFound.goHome")}</Button>
      </Link>
    </div>
  );
}
