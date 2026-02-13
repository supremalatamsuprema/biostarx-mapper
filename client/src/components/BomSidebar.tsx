import { GlassCard } from "@/components/ui/glass-card";
import { PillButton } from "@/components/ui/pill-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Package, Download, Mail, ClipboardList, Gift, DollarSign, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { downloadCSV, getTotalItems } from "@/lib/calc";
import { useI18n } from "@/lib/i18n";
import type { CalculatedBOM, ProjectMeta } from "@/types/license";

interface BomSidebarProps {
  calculatedBOM: CalculatedBOM;
  onGenerateReport: () => void;
  tierChanged?: boolean;
  meta: ProjectMeta;
  onSendEmail?: () => void;
  hasCapacityData?: boolean;
  isMigration?: boolean;
}

export function BomSidebar({ calculatedBOM, onGenerateReport, tierChanged, meta, onSendEmail, hasCapacityData = true, isMigration = false }: BomSidebarProps) {
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

  if (!hasCapacityData) {
    return (
      <div className="sticky top-10 z-50 print:hidden space-y-6 max-h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar pr-1">
        <GlassCard className="p-8 sm:p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center">
              <ClipboardList className="w-7 h-7 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium font-['Noto_Sans_KR'] text-foreground">
                {t("bom.noDataTitle")}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("bom.noDataDescription")}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="sticky top-10 z-50 print:hidden space-y-6 max-h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar pr-1">
      {/* Opción Recomendada */}
      <GlassCard className={cn(
        "overflow-hidden transition-all duration-300 border-2 border-primary shadow-lg ring-4 ring-primary/10",
        tierChanged && "scale-[1.02]"
      )}>
        <div className="p-6 border-b border-primary/20 transition-all duration-300 bg-[#a12944] text-[#171717]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-white/90">
              BOM ORIGINAL
            </p>
            <h3 className="text-xl sm:text-2xl font-medium font-['Noto_Sans_KR'] text-white">
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
          
          <div className="space-y-2">
            {bom.map((item, index) => (
              <div 
                key={`${item.id}-${index}`}
                className={cn(
                  "flex items-center justify-between p-3 rounded-md",
                  item.foc ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-muted/30"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-foreground truncate">{item.name}</p>
                    {item.foc && (
                      <Badge variant="outline" className="no-default-hover-elevate no-default-active-elevate text-[8px] px-1.5 py-0 h-4 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 shrink-0">
                        <Gift className="w-2.5 h-2.5 mr-0.5" />
                        {t("bom.foc")}
                      </Badge>
                    )}
                    {!item.foc && isMigration && (
                      <Badge variant="outline" className="no-default-hover-elevate no-default-active-elevate text-[8px] px-1.5 py-0 h-4 bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 shrink-0">
                        <DollarSign className="w-2.5 h-2.5 mr-0.5" />
                        {t("bom.withCost")}
                      </Badge>
                    )}
                  </div>
                  <p className="font-mono text-muted-foreground text-[14px] font-normal">{item.id}</p>
                </div>
                <div className="ml-3 px-3 py-1 bg-foreground text-background rounded-full text-xs font-black">
                  x{item.qty}
                </div>
              </div>
            ))}
          </div>

          {calculatedBOM.migrationNotes && calculatedBOM.migrationNotes.length > 0 && (
            <div className="mt-4 space-y-2">
              {calculatedBOM.migrationNotes.map((note, idx) => (
                <div key={idx} className="flex gap-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/30" data-testid={`migration-note-${idx}`}>
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-relaxed text-amber-800 dark:text-amber-300 font-medium">
                    {t(note.messageKey)}
                  </p>
                </div>
              ))}
            </div>
          )}
          
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
                <h3 className="text-xl font-medium font-['Noto_Sans_KR'] text-foreground">
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
            <div className="space-y-2">
              {alternative.bom.map((item, index) => (
                <div 
                  key={`alt-${item.id}-${index}`}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-md",
                    item.foc ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-muted/20"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground truncate text-[12px]">{item.name}</p>
                      {item.foc && (
                        <Badge variant="outline" className="no-default-hover-elevate no-default-active-elevate text-[8px] px-1.5 py-0 h-4 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 shrink-0">
                          <Gift className="w-2.5 h-2.5 mr-0.5" />
                          {t("bom.foc")}
                        </Badge>
                      )}
                      {!item.foc && isMigration && (
                        <Badge variant="outline" className="no-default-hover-elevate no-default-active-elevate text-[8px] px-1.5 py-0 h-4 bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 shrink-0">
                          <DollarSign className="w-2.5 h-2.5 mr-0.5" />
                          {t("bom.withCost")}
                        </Badge>
                      )}
                    </div>
                    <p className="font-mono text-muted-foreground text-[14px] font-normal">{item.id}</p>
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
      {onSendEmail && (
        <Button 
          variant="outline" 
          onClick={onSendEmail}
          className="w-full gap-2"
          data-testid="button-send-email-sidebar"
        >
          <Mail className="w-4 h-4" />
          {t("email.send")}
        </Button>
      )}
      <p className="text-[8px] text-muted-foreground leading-relaxed text-center px-4 italic">
        {t("disclaimer.note")}
      </p>
    </div>
  );
}
