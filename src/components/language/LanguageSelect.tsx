"use client";

import { Globe2 } from "lucide-react";

import { useLanguage } from "@/components/language/language-provider";
import { isSupportedLocale } from "@/lib/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export function LanguageSelect() {
  const { locale, setLocale, languageOptions, t } = useLanguage();

  return (
    <Select
      value={locale}
      onValueChange={(nextLocale) => {
        if (isSupportedLocale(nextLocale)) {
          setLocale(nextLocale);
        }
      }}
    >
      <SelectTrigger
        className="size-9 justify-center rounded-full p-0 [&>span]:flex [&>span]:size-full [&>span]:items-center [&>span]:justify-center [&>svg:last-child]:hidden"
        aria-label={t.language.selectLabel}
        title={t.language.selectLabel}
      >
        <Globe2 className="size-4" />
      </SelectTrigger>
      <SelectContent align="end">
        {languageOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.nativeLabel}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
