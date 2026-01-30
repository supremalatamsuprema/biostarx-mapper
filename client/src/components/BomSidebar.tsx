import { GlassCard } from "@/components/ui/glass-card";
import { PillButton } from "@/components/ui/pill-button";
import { Button } from "@/components/ui/button";
import { FileText, Package, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { downloadCSV, getTotalItems } from "@/lib/calc";
import { useI18n } from "@/lib/i18n";
import type { CalculatedBOM, ProjectMeta } from "@/types/license";

interface BomSidebarProps {
  calculatedBOM: CalculatedBOM;
  onGenerateReport: () => void;
  tierChanged?: boolean;
  meta: ProjectMeta;
}

export function BomSidebar({ calculatedBOM, onGenerateReport, tierChanged, meta }: BomSidebarProps) {
  const { bom, selected, alternative } = calculatedBOM;
  const totalItems = getTotalItems(bom);
  const { t } = useI18n();

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
    <div className="sticky top-10 z-50 print:hidden space-y-6 max-h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar pr-1">
      {/* Opción Recomendada */}
      <GlassCard className={cn(
        "overflow-hidden transition-all duration-300 border-2 border-primary shadow-lg ring-4 ring-primary/10",
        tierChanged && "scale-[1.02]"
      )}>
        <div className="bg-primary p-6 border-b border-primary/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/90">
                {t("bom.originalTitle")}
              </p>
              <h3 className="text-xl sm:text-2xl font-heading font-black text-white">
                BioStar X {selected.name}
              </h3>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-md p-3 text-center border border-white/10">
              <p className="text-[8px] font-bold text-white/70 uppercase tracking-wider">{t("bom.doors")}</p>
              <p className="text-lg font-black text-white">{selected.maxDoors}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-md p-3 text-center border border-white/10">
              <p className="text-[8px] font-bold text-white/70 uppercase tracking-wider">{t("bom.users")}</p>
              <p className="text-lg font-black text-white">{selected.maxUsers.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-md p-3 text-center border border-white/10">
              <p className="text-[8px] font-bold text-white/70 uppercase tracking-wider">{t("bom.ops")}</p>
              <p className="text-lg font-black text-white">{selected.maxOperators}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 sm:p-8 bg-white/50 dark:bg-card/50">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4 pb-2 border-b border-primary/10">
            {t("bom.title")}
          </h4>
          
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
            {bom.map((item, index) => (
              <div 
                key={`${item.id}-${index}`}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{item.name}</p>
                  <p className="font-mono text-muted-foreground text-[14px] font-normal">{item.id}</p>
                </div>
                <div className="ml-3 px-3 py-1 bg-foreground text-background rounded-full text-xs font-black">
                  x{item.qty}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-between items-center mb-0">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {t("bom.totalItems")}
              </span>
              <span className="text-lg font-heading font-black text-foreground">
                {totalItems}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
      {/* Opción Alternativa */}
      {alternative && (
        <GlassCard className="overflow-hidden border-[#0047FF]/30 border-2">
          <div className="bg-[#0047FF]/10 p-6 border-b border-[#0047FF]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-primary">
                  {t("bom.alternativeTitle")}
                </p>
                <h3 className="text-xl font-heading font-black text-foreground">
                  BioStar X {alternative.selected.name}
                </h3>
              </div>
            </div>
            
            <p className="text-[9px] text-muted-foreground mt-1 font-medium italic mb-4">
              * {alternative.reason}
            </p>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/50 rounded-md p-3 text-center">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">{t("bom.doors")}</p>
                <p className="text-lg font-black text-foreground">{alternative.selected.maxDoors}</p>
              </div>
              <div className="bg-muted/50 rounded-md p-3 text-center">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">{t("bom.users")}</p>
                <p className="text-lg font-black text-foreground">{alternative.selected.maxUsers.toLocaleString()}</p>
              </div>
              <div className="bg-muted/50 rounded-md p-3 text-center">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">{t("bom.ops")}</p>
                <p className="text-lg font-black text-foreground">{alternative.selected.maxOperators}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 sm:p-8 space-y-4">
            <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
              {alternative.bom.map((item, index) => (
                <div 
                  key={`alt-${item.id}-${index}`}
                  className="flex items-center justify-between p-2 bg-muted/20 rounded-md"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-foreground truncate">{item.name}</p>
                    <p className="text-[8px] font-mono text-muted-foreground">{item.id}</p>
                  </div>
                  <div className="ml-2 px-2 py-0.5 bg-foreground/80 text-background rounded-full text-[10px] font-black">
                    x{item.qty}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}
      <p className="text-[8px] text-muted-foreground leading-relaxed text-center px-4 italic">
        {t("disclaimer.note")}
      </p>
    </div>
  );
}
