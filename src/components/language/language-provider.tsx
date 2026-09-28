"use client";

import * as React from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import {
  defaultLocale,
  getDictionary,
  isSupportedLocale,
  languageOptions,
  type I18nDictionary,
  type Locale,
} from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  languageOptions: typeof languageOptions;
  t: I18nDictionary;
};

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

function applyDocumentLanguage(locale: Locale) {
  document.documentElement.lang = locale;
}

export function LanguageProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, updateCurrentUser } = useAuth();
  const userLocale = isSupportedLocale(user?.preferred_locale) ? user.preferred_locale : defaultLocale;
  const [locale, setLocaleState] = React.useState<Locale>(userLocale);

  const setLocale = React.useCallback(
    (nextLocale: Locale) => {
      setLocaleState(nextLocale);
      applyDocumentLanguage(nextLocale);

      if (user) {
        void updateCurrentUser({ preferred_locale: nextLocale }).catch(() => {
          setLocaleState(userLocale);
          applyDocumentLanguage(userLocale);
        });
      }
    },
    [updateCurrentUser, user, userLocale]
  );

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(userLocale);
    applyDocumentLanguage(userLocale);
  }, [userLocale]);

  const value = React.useMemo(
    () => ({
      locale,
      setLocale,
      languageOptions,
      t: getDictionary(locale),
    }),
    [locale, setLocale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
