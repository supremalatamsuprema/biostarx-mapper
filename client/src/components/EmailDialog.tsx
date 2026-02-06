import { useState } from "react";
import { Mail, Send, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import type { CalculatedBOM, ProjectMeta, ProjectInputs } from "@/types/license";

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calculatedBOM: CalculatedBOM;
  meta: ProjectMeta;
  inputs: ProjectInputs;
}

export function EmailDialog({ open, onOpenChange, calculatedBOM, meta, inputs }: EmailDialogProps) {
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [recipient, setRecipient] = useState("");
  const [cc, setCc] = useState("");
  const [sendToSuprema, setSendToSuprema] = useState(false);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [validationError, setValidationError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleSendClick = () => {
    setValidationError("");
    
    if (!recipient.trim()) {
      setValidationError(t("email.validationRequired"));
      return;
    }
    
    if (!validateEmail(recipient)) {
      setValidationError(t("email.validationInvalid"));
      return;
    }

    setShowPrivacyDialog(true);
  };

  const handleConfirmSend = async () => {
    setShowPrivacyDialog(false);
    setSending(true);
    
    try {
      const ccEmails = cc.split(",").map(e => e.trim()).filter(e => e && validateEmail(e));
      if (sendToSuprema) {
        ccEmails.push("latam@supremainc.com");
      }
      
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipient.trim(),
          cc: ccEmails,
          note,
          language,
          calculatedBOM,
          meta,
          inputs
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send email");
      }
      
      toast({
        title: t("email.success"),
        variant: "default"
      });
      
      onOpenChange(false);
      setRecipient("");
      setCc("");
      setSendToSuprema(false);
      setNote("");
    } catch (error) {
      toast({
        title: t("email.error"),
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              {t("email.title")}
            </DialogTitle>
            <DialogDescription>
              {meta.projectName || t("report.noName")} - BioStar X {calculatedBOM.selected.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email-recipient">{t("email.recipient")} *</Label>
              <Input
                id="email-recipient"
                type="email"
                placeholder={t("email.recipientPlaceholder")}
                value={recipient}
                onChange={(e) => {
                  setRecipient(e.target.value);
                  setValidationError("");
                }}
                data-testid="input-email-recipient"
              />
              {validationError && (
                <p className="text-sm text-destructive">{validationError}</p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="email-cc">{t("email.cc")}</Label>
              <Input
                id="email-cc"
                type="text"
                placeholder={t("email.ccPlaceholder")}
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                data-testid="input-email-cc"
              />
              <p className="text-xs text-muted-foreground">{t("email.ccHint")}</p>
            </div>
            
            {language !== 'en' && (
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                <Checkbox
                  id="send-suprema"
                  checked={sendToSuprema}
                  onCheckedChange={(checked) => setSendToSuprema(checked === true)}
                  data-testid="checkbox-send-suprema"
                />
                <div className="flex-1">
                  <Label htmlFor="send-suprema" className="cursor-pointer font-medium">
                    {t("email.sendToSuprema")}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t("email.sendToSupremaDesc")}
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email-note">{t("email.note")}</Label>
              <Textarea
                id="email-note"
                placeholder={t("email.notePlaceholder")}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                data-testid="input-email-note"
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-email-cancel"
            >
              <X className="w-4 h-4 mr-2" />
              {t("email.cancel")}
            </Button>
            <Button
              onClick={handleSendClick}
              disabled={sending}
              data-testid="button-email-send"
            >
              <Send className="w-4 h-4 mr-2" />
              {sending ? t("email.sending") : t("email.send")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("email.privacyTitle")}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>{t("email.privacyMessage")}</p>
              <a 
                href="https://www.supremainc.com/en/privacy-policy.asp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
              >
                {t("email.privacyLink")}
                <ExternalLink className="w-3 h-3" />
              </a>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-privacy-cancel">
              {t("email.privacyReject")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSend} data-testid="button-privacy-accept">
              {t("email.privacyAccept")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
