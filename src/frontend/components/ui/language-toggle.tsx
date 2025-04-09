import { Languages } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      title={t("common.language")}
      aria-label={t("common.language")}
    >
      <Languages className="h-5 w-5" />
      <span className="sr-only">{t("common.language")}</span>
    </Button>
  );
}
