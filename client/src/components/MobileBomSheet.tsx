import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PillButton } from "@/components/ui/pill-button";
import { Package, ChevronUp, FileText, Gift, DollarSign, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { CalculatedBOM } from "@/types/license";

interface MobileBomSheetProps {
  calculatedBOM: CalculatedBOM;
  onGenerateReport: () => void;
  hasCapacityData?: boolean;
  isMigration?: boolean;
}

export function MobileBomSheet({ calculatedBOM, onGenerateReport, hasCapacityData = true, isMigration = false }: MobileBomSheetProps) {
  const [open, setOpen] = useState(false);
  const { bom, selected, alternative } = calculatedBOM;
  const totalItems = bom.reduce((acc, item) => acc + item.qty, 0);
  const { t } = useI18n();

  if (!hasCapacityData) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-4 left-4 right-4 z-50 rounded-md bg-gradient-to-r from-[#00C2FF] via-[#0047FF] to-[#FF00E5] text-white font-bold shadow-lg xl:hidden"
          data-testid="button-mobile-bom"
        >
          <Package className="w-5 h-5 mr-2" />
          <span>BioStar X {selected.name}</span>
          <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm">
            {totalItems} {t("mobile.items")}
          </span>
          <ChevronUp className="w-5 h-5 ml-2" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-[90vh] rounded-t-xl overflow-hidden flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border bg-background sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-xl font-heading font-black">
                {t("bom.title")}
              </SheetTitle>
              <SheetDescription className="text-xs">
                {t("mobile.bomDescription")}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pb-32">
          {/* Opción Recomendada */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                {t("mobile.recommended")}
              </h3>
              <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">
                BioStar X {selected.name}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-muted/50 rounded-md p-3 text-center">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">{t("bom.doors")}</p>
                <p className="text-lg font-black">{selected.maxDoors}</p>
              </div>
              <div className="bg-muted/50 rounded-md p-3 text-center">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">{t("bom.users")}</p>
                <p className="text-lg font-black">{selected.maxUsers.toLocaleString()}</p>
              </div>
              <div className="bg-muted/50 rounded-md p-3 text-center">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">{t("bom.ops")}</p>
                <p className="text-lg font-black">{selected.maxOperators}</p>
              </div>
            </div>

            <div className="space-y-2">
              {bom.map((item, index) => (
                <div 
                  key={`rec-${item.id}-${index}`}
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
                    <p className="text-[9px] font-mono text-muted-foreground">{item.id}</p>
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
                  <div key={idx} className="flex gap-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/30">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed text-amber-800 dark:text-amber-300 font-medium">
                      {t(note.messageKey)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Opción Alternativa */}
          {alternative && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                  {t("mobile.alternative")}
                </h3>
                <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">
                  BioStar X {alternative.selected.name}
                </span>
              </div>
              
              <p className="text-[10px] text-muted-foreground italic">
                * {alternative.reason}
              </p>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-muted/50 rounded-md p-3 text-center">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">{t("bom.doors")}</p>
                  <p className="text-lg font-black">{alternative.selected.maxDoors}</p>
                </div>
                <div className="bg-muted/50 rounded-md p-3 text-center">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">{t("bom.users")}</p>
                  <p className="text-lg font-black">{alternative.selected.maxUsers.toLocaleString()}</p>
                </div>
                <div className="bg-muted/50 rounded-md p-3 text-center">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">{t("bom.ops")}</p>
                  <p className="text-lg font-black">{alternative.selected.maxOperators}</p>
                </div>
              </div>

              <div className="space-y-2">
                {alternative.bom.map((item, index) => (
                  <div 
                    key={`alt-${item.id}-${index}`}
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
                      <p className="text-[9px] font-mono text-muted-foreground">{item.id}</p>
                    </div>
                    <div className="ml-3 px-3 py-1 bg-foreground text-background rounded-full text-xs font-black">
                      x{item.qty}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t border-border z-20">
          <PillButton 
            onClick={() => {
              setOpen(false);
              onGenerateReport();
            }}
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            {t("mobile.generateMaster")}
          </PillButton>
          <p className="mt-3 text-[8px] text-muted-foreground leading-relaxed text-center">
            {t("disclaimer.note")}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
