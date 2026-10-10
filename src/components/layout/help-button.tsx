import { useNavigate } from "react-router-dom";
import { Button, HelpIcon } from "@/components/ui";
import { ROUTES } from "@/config/constants";
import { t } from "@/i18n";

export function HelpButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="md"
      className="px-2"
      aria-label={t("a11y.help")}
      onClick={() => navigate(ROUTES.HELP)}
    >
      <HelpIcon size="md" />
    </Button>
  );
}
