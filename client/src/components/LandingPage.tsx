import { Building2, ArrowRightLeft } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useI18n } from "@/lib/i18n";
import logoImg from "@assets/m_logo_Suprema_1768527453302.png";
import bxLogo from "@assets/image_1769729328685.png";
import type { ProjectInputs } from "@/types/license";

import BioStar_X_LOGO from "@assets/BioStar-X-LOGO.png";

interface LandingPageProps {
  onSelectScenario: (scenario: ProjectInputs['scenario']) => void;
}

export function LandingPage({ onSelectScenario }: LandingPageProps) {
  const { t } = useI18n();
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#00C2FF] via-[#0047FF] to-[#FF00E5] blur-[200px] opacity-10 rounded-full pointer-events-none" />
      <div className="max-w-5xl w-full relative z-10 space-y-12 sm:space-y-16 animate-fadeIn">
        <div className="text-left space-y-4 sm:space-y-6 max-w-3xl">
          <img 
            src={logoImg} 
            alt="Suprema Logo"
            className="h-6 sm:h-8 mb-4 object-contain" 
          />
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-2 mb-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-semibold text-foreground tracking-tight">
              {t("app.welcome")}
            </h1>
            <img 
              src={BioStar_X_LOGO} 
              alt="BioStar X Logo"
              className="h-[0.9em] sm:h-[0.9em] lg:h-[0.9em] w-auto object-contain self-center" 
            />
          </div>
          <p className="text-muted-foreground text-base sm:text-lg font-medium leading-relaxed">
            {t("app.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div 
            className="group bg-card p-8 sm:p-10 rounded-md border border-border cursor-pointer flex flex-col items-start hover-elevate"
            onClick={() => onSelectScenario('new')}
            data-testid="card-new-project"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-background shadow-sm flex items-center justify-center mb-6 sm:mb-8 border border-border">
              <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-foreground" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-foreground mb-3 sm:mb-4">
              {t("scenario.new")}
            </h2>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8 sm:mb-10">
              {t("scenario.new.desc")}
            </p>
            <PillButton variant="secondary">
              {t("scenario.new.button")}
            </PillButton>
          </div>

          <div 
            className="group bg-card p-8 sm:p-10 rounded-md border border-border cursor-pointer flex flex-col items-start hover-elevate"
            onClick={() => onSelectScenario('migration')}
            data-testid="card-migration"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-background shadow-sm flex items-center justify-center mb-6 sm:mb-8 border border-border">
              <ArrowRightLeft className="w-7 h-7 sm:w-8 sm:h-8 text-foreground" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-foreground mb-3 sm:mb-4">
              {t("scenario.migration")}
            </h2>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8 sm:mb-10">
              {t("scenario.migration.desc")}
            </p>
            <PillButton variant="secondary">
              {t("scenario.migration.button")}
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  );
}
