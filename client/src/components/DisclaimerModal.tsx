import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PillButton } from "@/components/ui/pill-button";
import { Shield, AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface DisclaimerModalProps {
  open: boolean;
  onAccept: () => void;
}

export function DisclaimerModal({ open, onAccept }: DisclaimerModalProps) {
  const { t } = useI18n();
  
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-lg rounded-md border-0 p-0 overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        aria-describedby={t("disclaimer.note") ? undefined : "disclaimer-desc"}
      >
        <div className="bg-gradient-to-br from-[#00C2FF] via-[#0047FF] to-[#FF00E5] p-1">
          <div className="bg-background rounded-md p-8">
            <DialogHeader className="space-y-4 mb-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-[#A12944]/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#A12944]" />
              </div>
              <DialogTitle className="text-2xl font-black font-['Noto_Sans_KR'] text-center">
                {t("disclaimer.title")}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-md border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed font-medium font-['Noto_Sans_KR']">
                  {t("disclaimer.text")}
                </p>
              </div>
              
              {t("disclaimer.note") && (
                <DialogDescription className="text-sm text-muted-foreground leading-relaxed text-center font-medium font-['Noto_Sans_KR']">
                  {t("disclaimer.note")}
                </DialogDescription>
              )}
            </div>

            <PillButton 
              onClick={onAccept}
              className="w-full"
              data-testid="button-accept-disclaimer"
            >
              {t("disclaimer.accept")}
            </PillButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
