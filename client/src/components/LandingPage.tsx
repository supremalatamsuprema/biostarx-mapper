import { Building2, ArrowRightLeft } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useI18n } from "@/lib/i18n";
import logoImg from "@assets/m_logo_Suprema_1768527453302.png";
import bxLogo from "@assets/image_1769729328685.png";
import type { ProjectInputs } from "@/types/license";

import BioStar_X_LOGO from "@assets/BioStar-X-LOGO.png";

import BioStar_X_LOGO2 from "@assets/BioStar-X-LOGO2.png";

interface LandingPageProps {
  onSelectScenario: (scenario: ProjectInputs['scenario']) => void;
}

export function LandingPage({ onSelectScenario }: LandingPageProps) {
  const { t } = useI18n();
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-start pt-20 sm:pt-32 p-4 sm:p-8">
      <div className="absolute top-4 left-4 z-20">
        <img 
          src={logoImg} 
          alt="Suprema Logo"
          className="h-8 sm:h-10 object-contain opacity-90" 
        />
      </div>
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>
      {/* Decorative background elements */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#00C2FF] via-[#0047FF] to-[#FF00E5] blur-[200px] opacity-5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-[#B12944] to-[#0047FF] blur-[200px] opacity-5 rounded-full pointer-events-none" />
      <div className="max-w-6xl w-full relative z-10 space-y-16 sm:space-y-24 animate-fadeIn">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-y-4 mb-8">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-heading text-foreground tracking-tight leading-none font-normal">
              {t("app.welcome")}
            </h1>
            <img 
              src={BioStar_X_LOGO2} 
              alt="BioStar X Logo"
              className="h-[3em] sm:h-[3.5em] lg:h-[4.2em] w-auto object-contain" 
            />
          </div>
          <p className="text-muted-foreground text-lg sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto text-justify">
            {t("app.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto">
          <div 
            className="group bg-card/50 backdrop-blur-sm p-10 sm:p-12 rounded-xl border border-border/50 cursor-pointer flex flex-col items-center text-center hover-elevate transition-all duration-300 hover:border-primary/20"
            onClick={() => onSelectScenario('new')}
            data-testid="card-new-project"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-background shadow-sm flex items-center justify-center mb-8 border border-border group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              {t("scenario.new")}
            </h2>
            <p className="text-muted-foreground text-base font-medium leading-relaxed mb-10 flex-grow">
              {t("scenario.new.desc")}
            </p>
            <PillButton variant="secondary" className="w-full sm:w-auto px-8 py-6 text-lg">
              {t("scenario.new.button")}
            </PillButton>
          </div>

          <div 
            className="group bg-card/50 backdrop-blur-sm p-10 sm:p-12 rounded-xl border border-border/50 cursor-pointer flex flex-col items-center text-center hover-elevate transition-all duration-300 hover:border-primary/20"
            onClick={() => onSelectScenario('migration')}
            data-testid="card-migration"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-background shadow-sm flex items-center justify-center mb-8 border border-border group-hover:scale-110 transition-transform duration-300">
              <ArrowRightLeft className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              {t("scenario.migration")}
            </h2>
            <p className="text-muted-foreground text-base font-medium leading-relaxed mb-10 flex-grow">
              {t("scenario.migration.desc")}
            </p>
            <PillButton variant="secondary" className="w-full sm:w-auto px-8 py-6 text-lg">
              {t("scenario.migration.button")}
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  );
}
