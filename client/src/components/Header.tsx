import { RefreshCcw, Download, FileText, ChevronDown, Headset, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useI18n } from "@/lib/i18n";
import logoImg from "@assets/m_logo_Suprema_1768527453302.png";
import logoDarkImg from "@assets/Suprema_logo_basic_1771952357115.png";
import { downloadCSV } from "@/lib/calc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CalculatedBOM, ProjectMeta, ProjectInputs } from "@/types/license";
import BioStar_X_LOGO2 from "@assets/BioStar-X-LOGO2.png";
import BioStar_X_LOGO_Dark from "@assets/BioStar-X_Signature_Horizontal-Combination_Negative_1771953390233.png";

interface HeaderProps {
  scenario: ProjectInputs['scenario'];
  onReset: () => void;
  calculatedBOM: CalculatedBOM;
  meta: ProjectMeta;
  onGenerateReport: () => void;
  hasCapacityData?: boolean;
}

export function Header({ scenario, onReset, calculatedBOM, meta, onGenerateReport, hasCapacityData = true }: HeaderProps) {
  const { t, language } = useI18n();
  const { bom, selected, alternative } = calculatedBOM;

  const handleExportCSV = () => {
    if (!hasCapacityData) return;
    downloadCSV({
      projectName: meta.projectName,
      client: meta.client,
      tierName: selected.name,
      bom: bom,
      alternative: alternative?.bom,
      alternativeTierName: alternative?.selected.name,
      language
    });
  };

  const handleGenerateReport = () => {
    if (!hasCapacityData) return;
    onGenerateReport();
  };
  
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10 print:hidden">
      <div className="flex items-center gap-4 sm:gap-8">
        <a 
          href="https://supremainc.com/en/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <img 
            src={logoImg} 
            alt="Suprema Logo"
            className="h-5 sm:h-6 object-contain dark:hidden" 
          />
          <img 
            src={logoDarkImg} 
            alt="Suprema Logo"
            className="h-5 sm:h-6 object-contain hidden dark:block" 
          />
        </a>
        <div className="h-6 sm:h-8 w-px bg-border hidden sm:block" />
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-xl font-heading font-semibold uppercase tracking-tighter">
            {t("header.calculador")}
          </span>
          <img 
            src={BioStar_X_LOGO2} 
            alt="BioStar X Logo"
            className="h-5 sm:h-6 object-contain dark:hidden" 
          />
          <img 
            src={BioStar_X_LOGO_Dark} 
            alt="BioStar X Logo"
            className="h-5 sm:h-6 object-contain hidden dark:block" 
          />
        </div>
      </div>

      <div className="flex gap-3 sm:gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2 mr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="default" 
                size="sm" 
                className="rounded-full bg-[#542051] hover:bg-[#B12944]/90 text-white font-semibold text-[10px] tracking-widest uppercase"
                data-testid="button-export-all"
                disabled={!hasCapacityData}
              >
                <Download className="w-3.5 h-3.5 mr-2" />
                {t("header.export")}
                <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <div className="px-2 py-1.5 mb-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t("header.formatsAvailable")}</p>
              </div>
              <DropdownMenuItem onClick={handleGenerateReport} className="cursor-pointer rounded-md focus:bg-primary/5 focus:text-primary py-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{t("header.pdfReport")}</span>
                  <span className="text-[10px] text-muted-foreground">{t("header.pdfDesc")}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer rounded-md focus:bg-[#0047FF]/5 focus:text-[#0047FF] py-2.5 mt-1">
                <div className="w-8 h-8 rounded-full bg-[#0047FF]/10 flex items-center justify-center mr-3">
                  <Download className="w-4 h-4 text-[#0047FF]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{t("header.csvFile")}</span>
                  <span className="text-[10px] text-muted-foreground">{t("header.csvDesc")}</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="rounded-full text-[10px] font-bold tracking-widest text-muted-foreground hover:text-primary"
        >
          <a href="https://support.supremainc.com/en/support/home" target="_blank" rel="noopener noreferrer">
            <Headset className="w-3.5 h-3.5 mr-2" />
            {t("header.support")}
          </a>
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="rounded-full text-[10px] font-bold tracking-widest text-muted-foreground hover:text-primary"
        >
          <a href="https://docs.supremainc.com/en/platform/biostar_x/licensing" target="_blank" rel="noopener noreferrer">
            <BookOpen className="w-3.5 h-3.5 mr-2" />
            {t("header.licenses")}
          </a>
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

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
