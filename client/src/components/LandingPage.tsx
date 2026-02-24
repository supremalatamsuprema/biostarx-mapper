import { Building2, ArrowRightLeft } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useI18n } from "@/lib/i18n";
import logoImg from "@assets/m_logo_Suprema_1768527453302.png";
import logoDarkImg from "@assets/Suprema_logo_basic_1771952357115.png";
import bxLogo from "@assets/image_1769729328685.png";
import type { ProjectInputs } from "@/types/license";

import BioStar_X_LOGO from "@assets/BioStar-X-LOGO.png";

import BioStar_X_LOGO2 from "@assets/BioStar-X-LOGO2.png";
import BioStar_X_LOGO_Dark from "@assets/BioStar-X_Signature_Horizontal-Combination_Negative_1771953390233.png";

interface LandingPageProps {
  onSelectScenario: (scenario: ProjectInputs['scenario']) => void;
}

export function LandingPage({ onSelectScenario }: LandingPageProps) {
  const { t } = useI18n();
  
  return (
    <div className="h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="absolute top-4 left-4 z-20">
        <img 
          src={logoImg} 
          alt="Suprema Logo"
          className="h-5 sm:h-6 object-contain opacity-90 dark:hidden" 
        />
        <img 
          src={logoDarkImg} 
          alt="Suprema Logo"
          className="h-5 sm:h-6 object-contain opacity-90 hidden dark:block" 
        />
      </div>
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>
      {/* Decorative background elements */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#00C2FF] via-[#0047FF] to-[#FF00E5] blur-[200px] opacity-5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-[#B12944] to-[#0047FF] blur-[200px] opacity-5 rounded-full pointer-events-none" />
      <div className="max-w-6xl w-full relative z-10 space-y-8 sm:space-y-12 animate-fadeIn" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 400 }}>
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-y-3 mb-4">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl tracking-tight leading-none text-[#000000] dark:text-[#a12944] bg-[transparent]" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 500 }}>
              {t("app.welcome")}
            </h1>
            <img 
              src={BioStar_X_LOGO2} 
              alt="BioStar X Logo"
              className="h-[2.5em] sm:h-[3em] lg:h-[3.5em] w-auto object-contain dark:hidden" 
            />
            <img 
              src={BioStar_X_LOGO_Dark} 
              alt="BioStar X Logo"
              className="h-[2.5em] sm:h-[3em] lg:h-[3.5em] w-auto object-contain hidden dark:block" 
            />
          </div>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-5xl mx-auto text-justify" style={{ fontWeight: 300 }}>
            {t("app.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <div 
            className="group backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-border/50 cursor-pointer flex flex-col items-center text-center hover-elevate transition-all duration-300 hover:border-primary/20 bg-[#efefef] dark:bg-[#78787a] text-[#171717]"
            onClick={() => onSelectScenario('new')}
            data-testid="card-new-project"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-background shadow-sm flex items-center justify-center mb-5 border border-border group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-3">
              {t("scenario.new")}
            </h2>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-6 flex-grow">
              {t("scenario.new.desc")}
            </p>
            <PillButton variant="secondary" className="w-full sm:w-auto px-6 py-4 text-base">
              {t("scenario.new.button")}
            </PillButton>
          </div>

          <div 
            className="group backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-border/50 cursor-pointer flex flex-col items-center text-center hover-elevate transition-all duration-300 hover:border-primary/20 text-[#171717] bg-[#efefef] dark:bg-[#78787a]"
            onClick={() => onSelectScenario('migration')}
            data-testid="card-migration"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-background shadow-sm flex items-center justify-center mb-5 border border-border group-hover:scale-110 transition-transform duration-300">
              <ArrowRightLeft className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-3">
              {t("scenario.migration")}
            </h2>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-6 flex-grow">
              {t("scenario.migration.desc")}
            </p>
            <PillButton variant="secondary" className="w-full sm:w-auto px-6 py-4 text-base">
              {t("scenario.migration.button")}
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  );
}
