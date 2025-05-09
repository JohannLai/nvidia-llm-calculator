"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

interface Language {
  locale: string;
  name: string;
}

const languages: Language[] = [
  { locale: "en", name: "English" },
  { locale: "zh", name: "中文" },
  { locale: "es", name: "Español" },
  { locale: "fr", name: "Français" },
  { locale: "de", name: "Deutsch" },
  { locale: "ja", name: "日本語" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onLanguageSelect = (newLocale: string) => {
    // Replace the locale segment of the pathname
    const path = pathname.replace(/^\/[^\/]+/, `/${newLocale}`);
    router.push(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-300 hover:text-white hover:bg-gray-800 border-none"
        >
          <Globe className="h-4 w-4 text-green-500" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.locale}
            onClick={() => onLanguageSelect(language.locale)}
            className={`text-gray-300 hover:text-white focus:text-white focus:bg-gray-800 ${
              locale === language.locale
                ? "text-white bg-gray-800 font-medium"
                : ""
            }`}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
