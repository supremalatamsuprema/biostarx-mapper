import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useI18n } from "@/lib/i18n";
import type { ProjectInputs } from "@/types/license";

interface HeaderProps {
  scenario: ProjectInputs['scenario'];
  onReset: () => void;
}

export function Header({ scenario, onReset }: HeaderProps) {
  const { t } = useI18n();
  
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10 print:hidden">
      <div className="flex items-center gap-4 sm:gap-8">
        <img 
          src="/attached_assets/m_logo_Suprema_1768527453302.png" 
          alt="Suprema Logo"
          className="h-5 sm:h-6" 
        />
        <div className="h-6 sm:h-8 w-px bg-border hidden sm:block" />
        <h2 className="text-lg sm:text-xl font-heading font-black uppercase tracking-tighter">
          BioStar <span className="text-[#A12944] italic">X</span> Mapper
        </h2>
      </div>

      <div className="flex gap-3 sm:gap-4 items-center flex-wrap">
        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
          {t("header.scenario")}: {scenario === 'migration' ? t("header.migration") : t("header.new")}
        </span>
        <LanguageSelector />
        <ThemeToggle />
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="rounded-full text-[10px] font-bold tracking-widest"
          data-testid="button-reset"
        >
          <RefreshCcw className="w-3 h-3 mr-2" />
          {t("header.reset")}
        </Button>
      </div>
    </header>
  );
}
