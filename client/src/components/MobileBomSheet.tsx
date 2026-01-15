import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PillButton } from "@/components/ui/pill-button";
import { Package, ChevronUp, FileText } from "lucide-react";
import { DISCLAIMER } from "@/data/licenseData";
import type { CalculatedBOM } from "@/types/license";

interface MobileBomSheetProps {
  calculatedBOM: CalculatedBOM;
  onGenerateReport: () => void;
}

export function MobileBomSheet({ calculatedBOM, onGenerateReport }: MobileBomSheetProps) {
  const [open, setOpen] = useState(false);
  const { bom, selected } = calculatedBOM;
  const totalItems = bom.reduce((acc, item) => acc + item.qty, 0);

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
            {totalItems} items
          </span>
          <ChevronUp className="w-5 h-5 ml-2" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-[80vh] rounded-t-md">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00C2FF] via-[#0047FF] to-[#FF00E5] flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                Tier Recomendado
              </p>
              <SheetTitle className="text-xl font-heading font-black">
                BioStar X {selected.name}
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-4 space-y-4 overflow-y-auto max-h-[calc(80vh-200px)] custom-scrollbar">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted/50 rounded-md p-3 text-center">
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Puertas</p>
              <p className="text-lg font-black">{selected.maxDoors}</p>
            </div>
            <div className="bg-muted/50 rounded-md p-3 text-center">
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Usuarios</p>
              <p className="text-lg font-black">{selected.maxUsers.toLocaleString()}</p>
            </div>
            <div className="bg-muted/50 rounded-md p-3 text-center">
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Ops</p>
              <p className="text-lg font-black">{selected.maxOperators}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Bill of Materials
            </h4>
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
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <PillButton 
            onClick={() => {
              setOpen(false);
              onGenerateReport();
            }}
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generar Reporte Maestro
          </PillButton>
          <p className="mt-3 text-[8px] text-muted-foreground leading-relaxed text-center">
            {DISCLAIMER}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
