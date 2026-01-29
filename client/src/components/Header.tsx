import { RefreshCcw, Download, FileText, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useI18n } from "@/lib/i18n";
import logoImg from "@assets/m_logo_Suprema_1768527453302.png";
import { downloadCSV } from "@/lib/calc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CalculatedBOM, ProjectMeta, ProjectInputs } from "@/types/license";

interface HeaderProps {
  scenario: ProjectInputs['scenario'];
  onReset: () => void;
  calculatedBOM: CalculatedBOM;
  meta: ProjectMeta;
  onGenerateReport: () => void;
}

export function Header({ scenario, onReset, calculatedBOM, meta, onGenerateReport }: HeaderProps) {
  const { t } = useI18n();
  const { bom, selected, alternative } = calculatedBOM;

  const handleExportCSV = () => {
    downloadCSV({
      projectName: meta.projectName,
      client: meta.client,
      tierName: selected.name,
      bom: bom,
      alternative: alternative?.bom,
      alternativeTierName: alternative?.selected.name
    });
  };
  
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10 print:hidden">
      <div className="flex items-center gap-4 sm:gap-8">
        <img 
          src={logoImg} 
          alt="Suprema Logo"
          className="h-5 sm:h-6 object-contain" 
        />
        <div className="h-6 sm:h-8 w-px bg-border hidden sm:block" />
        <h2 className="text-lg sm:text-xl font-heading font-black uppercase tracking-tighter">
          Calculador BioStar <span className="text-[#A12944] italic">X</span>
        </h2>
      </div>

      <div className="flex gap-3 sm:gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2 mr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="default" 
                size="sm" 
                className="rounded-full bg-[#A12944] hover:bg-[#A12944]/90 text-white font-bold text-[10px] tracking-widest uppercase"
                data-testid="button-export-all"
              >
                <Download className="w-3.5 h-3.5 mr-2" />
                Exportar
                <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onGenerateReport} className="cursor-pointer">
                <FileText className="w-4 h-4 mr-2" />
                <span>PDF (Reporte)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer">
                <Download className="w-4 h-4 mr-2" />
                <span>CSV (Excel)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
