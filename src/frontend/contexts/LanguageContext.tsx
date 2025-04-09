import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

type Direction = "ltr" | "rtl";
type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  toggleDirection: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>(
    (localStorage.getItem("i18nextLng") as Language) || "en",
  );
  const [direction, setDirection] = useState<Direction>(
    language === "ar" ? "rtl" : "ltr",
  );

  useEffect(() => {
    // Set direction based on language
    setDirection(language === "ar" ? "rtl" : "ltr");

    // Set HTML dir attribute
    document.documentElement.dir = direction;
    document.documentElement.lang = language;

    // Apply RTL-specific styles if needed
    if (direction === "rtl") {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
    localStorage.setItem("i18nextLng", lang);
  };

  const toggleDirection = () => {
    const newDirection = direction === "ltr" ? "rtl" : "ltr";
    setDirection(newDirection);
    setLanguage(newDirection === "rtl" ? "ar" : "en");
  };

  const value = {
    language,
    direction,
    setLanguage,
    toggleDirection,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
