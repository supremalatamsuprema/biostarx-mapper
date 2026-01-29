import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PillButton } from "@/components/ui/pill-button";
import { Printer, Copy, X, CheckCircle, Download, Package } from "lucide-react";
import { useState } from "react";
import { downloadCSV } from "@/lib/calc";
import { useI18n } from "@/lib/i18n";
import type { ProjectMeta, ProjectInputs, FeatureFlags, CalculatedBOM } from "@/types/license";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  meta: ProjectMeta;
  inputs: ProjectInputs;
  features: FeatureFlags;
  calculatedBOM: CalculatedBOM;
}

export function ReportModal({ 
  open, 
  onClose, 
  meta, 
  inputs, 
  features,
  calculatedBOM 
}: ReportModalProps) {
  const [copied, setCopied] = useState(false);
  const { bom, selected } = calculatedBOM;
  const { t, language } = useI18n();
  
  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const bomText = bom.map(item => `${item.id} - ${item.name} x${item.qty}`).join('\n');
    const text = `
${t("report.title").toUpperCase()} - BioStar X Mapper
===================================

${t("report.project").toUpperCase()}: ${meta.projectName || t("report.noName")}
${t("report.client").toUpperCase()}: ${meta.client || t("report.noSpec")}
${t("report.country").toUpperCase()}: ${meta.country || t("report.noSpec")}
${t("report.type").toUpperCase()}: ${meta.clientType}
${t("report.scenario").toUpperCase()}: ${inputs.scenario === 'migration' ? t("scenario.migration") : t("scenario.new")}

${t("report.contactInfo").toUpperCase()}
--------
${meta.contactFirst} ${meta.contactLast}
${meta.email}
${meta.phone}

${t("capacity.title").toUpperCase()}
----------------
${t("capacity.users")}: ${inputs.users}
${t("capacity.doors")}: ${inputs.doors}
${t("capacity.devices")}: ${inputs.devices}
${t("capacity.operators")}: ${inputs.operators}

${t("report.recommendedTier").toUpperCase()}
----------------
BioStar X ${selected.name}
- ${t("report.maxDoors")}: ${selected.maxDoors}
- ${t("report.maxUsers")}: ${selected.maxUsers.toLocaleString()}
- ${t("report.maxOps")}: ${selected.maxOperators}

${t("report.bom").toUpperCase()}
-----------------
${bomText}

---
${t("disclaimer.note")}
    `.trim();
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    downloadCSV({
      projectName: meta.projectName,
      client: meta.client,
      tierName: selected.name,
      bom,
      alternative: calculatedBOM.alternative?.bom,
      alternativeTierName: calculatedBOM.alternative?.selected.name
    });
  };

  const activeFeatures = Object.entries(features)
    .filter(([_, value]) => value)
    .map(([key]) => key);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-md p-0 print:max-w-none print:h-auto print:overflow-visible">
        <div className="p-6 sm:p-8 print:p-4">
          <DialogHeader className="mb-6 print:mb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl sm:text-3xl font-heading font-black">
                {t("report.title")}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {t("report.title")} - BioStar X
              </DialogDescription>
              <div className="flex items-center gap-2 print:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleExportCSV}
                  className="rounded-full"
                  data-testid="button-export-csv"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="rounded-full"
                  data-testid="button-copy-report"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrint}
                  className="rounded-full"
                  data-testid="button-print-report"
                >
                  <Printer className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full"
                  data-testid="button-close-report"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 print:space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <img 
                src="/attached_assets/m_logo_Suprema_1768527453302.png" 
                alt="Suprema Logo"
                className="h-6" 
              />
              <div className="h-6 w-px bg-border" />
              <span className="text-sm font-heading font-bold uppercase tracking-tight">
                BioStar <span className="text-[#A12944] italic">X</span> Mapper
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-2">
                  {t("report.projectInfo")}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">{t("report.project")}:</span>
                    <span className="text-xs font-bold">{meta.projectName || t("report.noName")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">{t("report.client")}:</span>
                    <span className="text-xs font-bold">{meta.client || t("report.noSpec")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">{t("report.country")}:</span>
                    <span className="text-xs font-bold">{meta.country || t("report.noSpec")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">{t("report.type")}:</span>
                    <span className="text-xs font-bold">{meta.clientType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">{t("report.scenario")}:</span>
                    <span className="text-xs font-bold">
                      {inputs.scenario === 'migration' ? t("scenario.migration") : t("scenario.new")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-2">
                  {t("report.contactInfo")}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">{t("report.name")}:</span>
                    <span className="text-xs font-bold">{meta.contactFirst} {meta.contactLast}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">{t("report.email")}:</span>
                    <span className="text-xs font-bold">{meta.email || t("report.noSpec")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">{t("report.phone")}:</span>
                    <span className="text-xs font-bold">{meta.phone || t("report.noSpec")}</span>
                  </div>
                </div>
              </div>
            </div>

            {inputs.scenario === 'migration' && (
              <div className="p-4 bg-[#0047FF]/5 rounded-md border border-[#0047FF]/20">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0047FF] mb-3">
                  {t("report.migrationValidation")}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">{t("report.bs2Version")}:</span>
                    <span className="text-xs font-bold">{meta.bs2Version || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">{t("report.activationCode")}:</span>
                    <span className="text-xs font-bold font-mono">{meta.activationCode || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">{t("report.hardware")}:</span>
                    <span className="text-xs font-bold">{meta.hardwareChecked ? t("migration.verified") : t("migration.notVerified")}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-md">
              <div className="text-center">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{t("capacity.users")}</p>
                <p className="text-2xl font-heading font-black text-foreground">{inputs.users.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{t("capacity.doors")}</p>
                <p className="text-2xl font-heading font-black text-foreground">{inputs.doors}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{t("capacity.devices")}</p>
                <p className="text-2xl font-heading font-black text-foreground">{inputs.devices}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{t("capacity.operators")}</p>
                <p className="text-2xl font-heading font-black text-foreground">{inputs.operators}</p>
              </div>
            </div>

            {activeFeatures.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {t("report.selectedFeatures")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeFeatures.map(feature => (
                    <span 
                      key={feature}
                      className="px-3 py-1 bg-[#A12944]/10 text-[#A12944] rounded-full text-[10px] font-bold uppercase tracking-wider"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comparativa de Opciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Opción Principal */}
              <div className="border-2 border-primary/20 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="bg-primary/5 p-4 border-b border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">OPCIÓN RECOMENDADA</p>
                      <h4 className="text-xl font-heading font-black text-foreground leading-tight">BioStar X {calculatedBOM.selected.name}</h4>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-2 py-3 border-b border-dashed">
                    <div className="text-center">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">Puertas</p>
                      <p className="text-base font-black">{calculatedBOM.selected.maxDoors}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">Usuarios</p>
                      <p className="text-base font-black">{calculatedBOM.selected.maxUsers.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">Operadores</p>
                      <p className="text-base font-black">{calculatedBOM.selected.maxOperators}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-2">Desglose de Licencias:</p>
                    {calculatedBOM.bom.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm py-1 border-b border-muted last:border-0">
                        <span className="text-muted-foreground font-medium">{item.name} <span className="text-[10px] font-mono opacity-50 ml-1">({item.id})</span></span>
                        <span className="font-bold">x{item.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Opción Alternativa */}
              {calculatedBOM.alternative && (
                <div className="border-2 border-[#0047FF]/20 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="bg-[#0047FF]/5 p-4 border-b border-[#0047FF]/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0047FF]/10 flex items-center justify-center">
                        <Package className="w-4 h-4 text-[#0047FF]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#0047FF]">OPCIÓN OPTIMIZADA</p>
                        <h4 className="text-xl font-heading font-black text-foreground leading-tight">BioStar X {calculatedBOM.alternative.selected.name}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <p className="text-[10px] text-[#0047FF] font-bold italic bg-[#0047FF]/5 p-2 rounded border border-[#0047FF]/10">
                      * {calculatedBOM.alternative.reason}
                    </p>
                    <div className="grid grid-cols-3 gap-2 py-3 border-b border-dashed">
                      <div className="text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Puertas</p>
                        <p className="text-base font-black">{calculatedBOM.alternative.selected.maxDoors}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Usuarios</p>
                        <p className="text-base font-black">{calculatedBOM.alternative.selected.maxUsers.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Operadores</p>
                        <p className="text-base font-black">{calculatedBOM.alternative.selected.maxOperators}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-2">Desglose de Licencias:</p>
                      {calculatedBOM.alternative.bom.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm py-1 border-b border-muted last:border-0">
                          <span className="text-muted-foreground font-medium">{item.name} <span className="text-[10px] font-mono opacity-50 ml-1">({item.id})</span></span>
                          <span className="font-bold">x{item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#0047FF]/5 rounded-md border border-[#0047FF]/20">
              <p className="text-xs text-foreground leading-relaxed">
                {t("report.purchaseNote")}
              </p>
              <div className="mt-4 pt-4 border-t border-[#0047FF]/10">
                <p className="text-xs text-foreground leading-relaxed">
                  {t("report.contactNote")}{' '}
                  <a href="mailto:latam@supremainc.com" className="text-[#0047FF] font-bold hover:underline">latam@supremainc.com</a>, {t("report.supportNote")}
                </p>
                <p className="text-xs text-foreground leading-relaxed mt-3 font-bold">
                  {t("report.closingNote")}
                </p>
                <p className="text-sm text-[#A12944] font-black mt-2 uppercase tracking-tighter">
                  Suprema LATAM — latam@supremainc.com
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 pb-2 border-b border-border">
                {t("report.bom")}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{t("report.partNumber")}</th>
                      <th className="text-left py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{t("report.description")}</th>
                      <th className="text-right py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{t("report.quantity")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bom.map((item, index) => (
                      <tr key={`${item.id}-${index}`} className="border-b border-border/50">
                        <td className="py-3 text-xs font-mono font-bold">{item.id}</td>
                        <td className="py-3 text-xs">{item.name}</td>
                        <td className="py-3 text-xs font-bold text-right">{item.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-[8px] text-muted-foreground text-center leading-relaxed">
                {t("disclaimer.note")}
              </p>
              <p className="text-[8px] text-muted-foreground text-center mt-2">
                {t("report.generated")}: {new Date().toLocaleString(language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES')}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 print:hidden">
            <Button variant="outline" onClick={onClose} className="rounded-full">
              {t("report.close")}
            </Button>
            <PillButton onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              {t("report.print")}
            </PillButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
