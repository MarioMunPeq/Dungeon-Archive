import { useNavigate } from "react-router-dom";
import { Button, HelpIcon } from "@/components/ui";
import { ROUTES } from "@/config/constants";

export function HelpButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="md"
      className="px-2"
      aria-label="Help"
      onClick={() => navigate(ROUTES.HELP)}
    >
      <HelpIcon size="md" />
    </Button>
  );
}
