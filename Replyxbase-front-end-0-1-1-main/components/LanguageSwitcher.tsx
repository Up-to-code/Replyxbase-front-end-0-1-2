"use client";

import { useCurrentLocale } from "@/lib/i18n-client";
import { Link, usePathname } from "@/i18n/routing";

const locales = ["ar", "en"] as const;

export const LanguageSwitcher = () => {
  const pathname = usePathname();
  const activeLocale = useCurrentLocale();

  // To keep things simple, we just show Arabic & English.
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        اللغة {/* "Language" in Arabic */}
      </span>
      <select
        className="bg-transparent text-sm font-semibold outline-none"
        value={activeLocale}
        onChange={(event) => {
          const nextLocale = event.target.value;
          if (nextLocale !== activeLocale) {
            // Link component from next-intl navigation requires locale prop.
            window.location.href = `/${nextLocale}${pathname.replace(/^\/(ar|en)/, '')}`;
          }
        }}
      >
        {locales.map((locale) => (
          <option key={locale} value={locale} className="text-slate-900">
            {locale === "ar" ? "العربية" : "English"}
          </option>
        ))}
      </select>
    </div>
  );
};
