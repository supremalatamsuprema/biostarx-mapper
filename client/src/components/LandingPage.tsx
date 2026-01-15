import { Building2, ArrowRightLeft } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import type { ProjectInputs } from "@/types/license";

interface LandingPageProps {
  onSelectScenario: (scenario: ProjectInputs['scenario']) => void;
}

export function LandingPage({ onSelectScenario }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#00C2FF] via-[#0047FF] to-[#FF00E5] blur-[200px] opacity-10 rounded-full pointer-events-none" />

      <div className="max-w-5xl w-full relative z-10 space-y-12 sm:space-y-16 animate-fadeIn">
        <div className="text-left space-y-4 sm:space-y-6 max-w-3xl">
          <img 
            src="https://www.supremainc.com/es/images/logo.png" 
            alt="Suprema Logo"
            className="h-6 sm:h-8 mb-4 grayscale opacity-80" 
          />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-[#A12944] tracking-tight leading-none">
            Bienvenido a<br />BioStar X Mapper
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg font-medium leading-relaxed">
            BioStar X Mapper es una herramienta diseñada para facilitar el cálculo y la selección correcta del licenciamiento de BioStar X. A través de este tool, es posible identificar de manera rápida y precisa las licencias necesarias según el tamaño, alcance y configuración de cada proyecto.
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
              Proyecto Nuevo
            </h2>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8 sm:mb-10">
              Implementación desde cero (Greenfield) diseñada nativamente para BioStar X.
            </p>
            <PillButton variant="secondary">
              Iniciar Configuración
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
              Migración BioStar 2
            </h2>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8 sm:mb-10">
              Actualización de un sistema existente (Legacy) a la nueva plataforma.
            </p>
            <PillButton variant="secondary">
              Gestionar Upgrade
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  );
}
