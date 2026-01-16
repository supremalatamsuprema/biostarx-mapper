import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useI18n, type Language } from "@/lib/i18n";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "es", label: "Español", flag: "ES" },
  { code: "en", label: "English", flag: "EN" },
  { code: "pt", label: "Português", flag: "PT" },
];

export function LanguageSelector() {
  const { language, setLanguage } = useI18n();
  const current = languages.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full gap-2"
          data-testid="button-language-selector"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold tracking-wider">{current?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-muted" : ""}
            data-testid={`menu-language-${lang.code}`}
          >
            <span className="font-bold mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
