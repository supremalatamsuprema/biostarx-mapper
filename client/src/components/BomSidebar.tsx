import { GlassCard } from "@/components/ui/glass-card";
import { PillButton } from "@/components/ui/pill-button";
import { FileText, Package } from "lucide-react";
import { DISCLAIMER } from "@/data/licenseData";
import type { CalculatedBOM } from "@/types/license";

interface BomSidebarProps {
  calculatedBOM: CalculatedBOM;
  onGenerateReport: () => void;
}

export function BomSidebar({ calculatedBOM, onGenerateReport }: BomSidebarProps) {
  const { bom, selected } = calculatedBOM;
  const totalItems = bom.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="sticky top-6 print:hidden">
      <GlassCard className="overflow-hidden">
        <div className="bg-gradient-to-br from-[#00C2FF] via-[#0047FF] to-[#FF00E5] p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/70">
                Tier Recomendado
              </p>
              <h3 className="text-xl sm:text-2xl font-heading font-black text-white">
                BioStar X {selected.name}
              </h3>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/10 rounded-md p-3 text-center">
              <p className="text-[8px] font-bold text-white/60 uppercase tracking-wider">Puertas</p>
              <p className="text-lg font-black text-white">{selected.maxDoors}</p>
            </div>
            <div className="bg-white/10 rounded-md p-3 text-center">
              <p className="text-[8px] font-bold text-white/60 uppercase tracking-wider">Usuarios</p>
              <p className="text-lg font-black text-white">{selected.maxUsers.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-md p-3 text-center">
              <p className="text-[8px] font-bold text-white/60 uppercase tracking-wider">Ops</p>
              <p className="text-lg font-black text-white">{selected.maxOperators}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 sm:p-8">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 pb-2 border-b border-border">
            Bill of Materials
          </h4>
          
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
            {bom.map((item, index) => (
              <div 
                key={`${item.id}-${index}`}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{item.name}</p>
                  <p className="text-[9px] font-mono text-muted-foreground">{item.id}</p>
                </div>
                <div className="ml-3 px-3 py-1 bg-foreground text-background rounded-full text-xs font-black">
                  x{item.qty}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Items
              </span>
              <span className="text-lg font-heading font-black text-foreground">
                {totalItems}
              </span>
            </div>
            
            <PillButton 
              onClick={onGenerateReport}
              className="w-full"
              data-testid="button-generate-report"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generar Reporte Maestro
            </PillButton>
          </div>
          
          <p className="mt-4 text-[8px] text-muted-foreground leading-relaxed text-center">
            {DISCLAIMER}
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
