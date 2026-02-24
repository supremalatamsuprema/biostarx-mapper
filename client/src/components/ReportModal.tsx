import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PillButton } from "@/components/ui/pill-button";
import { Printer, Copy, X, CheckCircle, Download, Package, Mail, Gift, DollarSign, AlertTriangle } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useI18n } from "@/lib/i18n";
import logoImg from "@assets/m_logo_Suprema_1768527453302.png";
import logoDarkImg from "@assets/Suprema_logo_basic_1771952357115.png";
import biostarXLogo from "@assets/BioStar-X-LOGO2.png";
import biostarXLogoDark from "@assets/BioStar-X_Signature_Horizontal-Combination_Negative_1771953390233.png";
import type { ProjectMeta, ProjectInputs, FeatureFlags, CalculatedBOM } from "@/types/license";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  meta: ProjectMeta;
  inputs: ProjectInputs;
  features: FeatureFlags;
  calculatedBOM: CalculatedBOM;
  onSendEmail?: () => void;
}

export function ReportModal({ 
  open, 
  onClose, 
  meta, 
  inputs, 
  features,
  calculatedBOM,
  onSendEmail
}: ReportModalProps) {
  const [copied, setCopied] = useState(false);
  const { bom, selected } = calculatedBOM;
  const { t, language } = useI18n();
  const isMigration = inputs.scenario === 'migration';
  
  const dialogRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      const scrollParent = dialog.closest('[role="dialog"]') as HTMLElement;
      const portal = dialog.closest('[data-radix-portal]') as HTMLElement;
      
      if (scrollParent) {
        scrollParent.scrollTop = 0;
      }

      const overlay = portal?.querySelector(':scope > [data-state]:not([role="dialog"])') as HTMLElement;
      const origOverlayDisplay = overlay?.style.display;
      if (overlay) {
        overlay.style.display = 'none';
      }

      const origStyles: { el: HTMLElement; maxHeight: string; overflow: string; position: string; transform: string; inset: string; width: string; }[] = [];
      if (scrollParent) {
        origStyles.push({
          el: scrollParent,
          maxHeight: scrollParent.style.maxHeight,
          overflow: scrollParent.style.overflow,
          position: scrollParent.style.position,
          transform: scrollParent.style.transform,
          inset: scrollParent.style.inset,
          width: scrollParent.style.width,
        });
        scrollParent.style.maxHeight = 'none';
        scrollParent.style.overflow = 'visible';
        scrollParent.style.position = 'static';
        scrollParent.style.transform = 'none';
        scrollParent.style.inset = 'auto';
        scrollParent.style.width = '100%';
      }

      const origTitle = document.title;
      document.title = `BioStar X - ${meta.projectName || 'Report'}`;

      requestAnimationFrame(() => {
        window.print();
        document.title = origTitle;
        
        if (overlay) {
          overlay.style.display = origOverlayDisplay || '';
        }
        origStyles.forEach(({ el, maxHeight, overflow, position, transform, inset, width }) => {
          el.style.maxHeight = maxHeight;
          el.style.overflow = overflow;
          el.style.position = position;
          el.style.transform = transform;
          el.style.inset = inset;
          el.style.width = width;
        });
      });
    } else {
      window.print();
    }
  }, []);

  const handleCopy = () => {
    const bomText = bom.map(item => `${item.id} - ${item.name} x${item.qty}${item.foc ? ' [FOC]' : ''}`).join('\n');
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

  const [generating, setGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (!dialogRef.current || generating) return;
    setGenerating(true);
    try {
      const element = dialogRef.current;
      const clone = element.cloneNode(true) as HTMLElement;

      clone.querySelectorAll('.print\\:hidden').forEach(el => (el as HTMLElement).remove());
      clone.querySelectorAll('.hidden.print\\:block').forEach(el => {
        (el as HTMLElement).classList.remove('hidden');
        (el as HTMLElement).style.display = 'block';
      });
      clone.querySelectorAll('.dark\\:block').forEach(el => (el as HTMLElement).style.display = 'none');
      clone.querySelectorAll('.dark\\:hidden').forEach(el => (el as HTMLElement).style.display = 'block');
      clone.querySelectorAll('.tier-capacity-number').forEach(el => {
        (el as HTMLElement).style.color = '#888';
      });

      const lightVars: Record<string, string> = {
        '--background': '0 0% 100%',
        '--foreground': '0 0% 9%',
        '--border': '0 0% 93%',
        '--card': '0 0% 98%',
        '--card-foreground': '0 0% 9%',
        '--card-border': '0 0% 95%',
        '--popover': '0 0% 94%',
        '--popover-foreground': '0 0% 9%',
        '--primary': '348 63% 43%',
        '--primary-foreground': '348 63% 98%',
        '--secondary': '0 0% 47%',
        '--secondary-foreground': '0 0% 100%',
        '--muted': '0 0% 92%',
        '--muted-foreground': '0 0% 35%',
        '--accent': '222 100% 50%',
        '--accent-foreground': '222 100% 98%',
        '--destructive': '0 84% 35%',
        '--destructive-foreground': '0 84% 98%',
        '--input': '0 0% 75%',
        '--ring': '348 63% 43%',
      };

      const a4WidthPx = 794;
      const paddingPx = 57;

      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        position: fixed;
        left: 0;
        top: 0;
        width: ${a4WidthPx}px;
        background: white;
        color: hsl(0 0% 9%);
        z-index: -9999;
        overflow: visible;
        visibility: visible;
        opacity: 1;
      `;
      Object.entries(lightVars).forEach(([k, v]) => wrapper.style.setProperty(k, v));

      clone.style.padding = `${paddingPx}px`;
      clone.style.background = 'white';
      clone.style.color = 'hsl(0 0% 9%)';
      clone.style.maxHeight = 'none';
      clone.style.overflow = 'visible';

      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      await new Promise(r => setTimeout(r, 500));

      clone.querySelectorAll('*').forEach(el => {
        const htmlEl = el as HTMLElement;
        const computed = window.getComputedStyle(htmlEl);
        if (computed.color === 'rgb(255, 255, 255)' || computed.color === 'rgba(255, 255, 255, 1)') {
          const hasBg = computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)' && computed.backgroundColor !== 'transparent';
          if (!hasBg) {
            htmlEl.style.color = 'hsl(0 0% 9%)';
          }
        }
      });

      clone.querySelectorAll('.rounded-full').forEach(el => {
        const htmlEl = el as HTMLElement;
        const computed = window.getComputedStyle(htmlEl);

        const svgs = htmlEl.querySelectorAll('svg');
        svgs.forEach(svg => svg.remove());

        htmlEl.style.display = 'inline-block';
        htmlEl.style.borderRadius = '9999px';
        htmlEl.style.whiteSpace = 'nowrap';
        htmlEl.style.textAlign = 'center';
        htmlEl.style.verticalAlign = 'middle';
        htmlEl.style.lineHeight = '2';
        htmlEl.style.padding = '0 10px';
        htmlEl.style.fontSize = computed.fontSize;
        htmlEl.style.fontWeight = computed.fontWeight;
        htmlEl.style.overflow = 'visible';
        if (computed.backgroundColor !== 'rgba(0, 0, 0, 0)' && computed.backgroundColor !== 'transparent') {
          htmlEl.style.backgroundColor = computed.backgroundColor;
        }
        htmlEl.style.color = computed.color;
        htmlEl.style.borderWidth = computed.borderWidth;
        htmlEl.style.borderStyle = computed.borderStyle;
        htmlEl.style.borderColor = computed.borderColor;
      });

      await new Promise(r => setTimeout(r, 200));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: a4WidthPx,
        windowWidth: a4WidthPx,
      });

      document.body.removeChild(wrapper);

      const imgWidthMm = 210;
      const pageHeightMm = 297;
      const marginMm = 15;
      const contentWidthMm = imgWidthMm - marginMm * 2;
      const totalImgHeightMm = (canvas.height * contentWidthMm) / canvas.width;
      const pageContentHeightMm = pageHeightMm - marginMm * 2;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const totalPages = Math.ceil(totalImgHeightMm / pageContentHeightMm);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        const sourceY = (page * pageContentHeightMm / totalImgHeightMm) * canvas.height;
        const sourceHeight = Math.min(
          (pageContentHeightMm / totalImgHeightMm) * canvas.height,
          canvas.height - sourceY
        );

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
        }

        const pageImgData = pageCanvas.toDataURL('image/png');
        const sliceHeightMm = (sourceHeight * contentWidthMm) / canvas.width;
        pdf.addImage(pageImgData, 'PNG', marginMm, marginMm, contentWidthMm, sliceHeightMm);

        pdf.setFontSize(7);
        pdf.setTextColor(136, 136, 136);
        pdf.text('www.supremainc.com', imgWidthMm - marginMm, pageHeightMm - 8, { align: 'right' });
        pdf.text(`${page + 1}/${totalPages}`, imgWidthMm - marginMm, pageHeightMm - 4, { align: 'right' });
      }

      const fileName = `BioStarX_${meta.projectName || 'Report'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  const activeFeatures = Object.entries(features)
    .filter(([_, value]) => value)
    .map(([key]) => key);

  const printTimestamp = new Date().toLocaleString(language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="report-dialog-content max-w-4xl max-h-[90vh] overflow-y-auto rounded-md p-0">
        <div className="hidden print:block print-header">
          <span>{printTimestamp}</span>
        </div>
        <div className="hidden print:block print-footer" aria-hidden="true">
          <span>www.supremainc.com</span>
        </div>
        <div ref={dialogRef} className="p-6 sm:p-8 print:p-6 print:pt-8">
          <DialogHeader className="mb-6 print:mb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl sm:text-3xl font-heading font-semibold">
                {t("report.title")}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {t("report.title")} - BioStar X
              </DialogDescription>
              <div className="flex items-center gap-2 print:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDownloadPDF}
                  disabled={generating}
                  className="rounded-full"
                  data-testid="button-export-pdf"
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
                src={logoImg} 
                alt="Suprema Logo"
                className="h-6 dark:hidden" 
              />
              <img 
                src={logoDarkImg} 
                alt="Suprema Logo"
                className="h-6 hidden dark:block" 
              />
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-heading font-semibold uppercase tracking-tight">
                  {t("header.calculador")}
                </span>
                <img
                  src={biostarXLogo}
                  alt="BioStar X Logo"
                  className="h-5 object-contain dark:hidden"
                />
                <img
                  src={biostarXLogoDark}
                  alt="BioStar X Logo"
                  className="h-5 object-contain hidden dark:block"
                />
              </div>
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
                <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">{t("capacity.users")}</p>
                <p className="text-2xl font-heading font-semibold text-foreground">{inputs.users.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">{t("capacity.doors")}</p>
                <p className="text-2xl font-heading font-semibold text-foreground">{inputs.doors}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">{t("capacity.devices")}</p>
                <p className="text-2xl font-heading font-semibold text-foreground">{inputs.devices}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">{t("capacity.operators")}</p>
                <p className="text-2xl font-heading font-semibold text-foreground">{inputs.operators}</p>
              </div>
            </div>

            {activeFeatures.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {t("report.selectedFeatures")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeFeatures.map(feature => (
                    <span 
                      key={feature}
                      className="px-3 py-1.5 bg-[#B12944]/10 text-[#B12944] rounded-full text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap leading-none"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comparativa de Opciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 print:grid-cols-1 print:gap-6">
              {/* Opción Principal - Resaltada */}
              <div className="border-2 border-primary rounded-xl overflow-hidden bg-white shadow-md ring-2 ring-primary/20 ring-offset-2 print:break-inside-avoid">
                <div className="bg-primary p-4 border-b border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/90">{t("report.recommendedOption")}</p>
                      <h4 className="text-xl font-heading font-semibold text-white leading-tight">BioStar X {calculatedBOM.selected.name}</h4>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-2 py-3 border-b border-dashed">
                    <div className="text-center">
                      <p className="text-[9px] font-semibold text-muted-foreground uppercase">{t("report.doors")}</p>
                      <p className="text-base font-semibold tier-capacity-number">{calculatedBOM.selected.maxDoors}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-semibold text-muted-foreground uppercase">{t("report.users")}</p>
                      <p className="text-base font-semibold tier-capacity-number">{calculatedBOM.selected.maxUsers.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-semibold text-muted-foreground uppercase">{t("report.operators")}</p>
                      <p className="text-base font-semibold tier-capacity-number">{calculatedBOM.selected.maxOperators}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider mb-2">{t("report.licenseBreakdown")}</p>
                    {calculatedBOM.bom.map((item, idx) => (
                      <div key={idx} className={`flex justify-between items-center text-sm py-2 px-3 rounded-md mb-2 ${item.foc ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-muted/20 border border-primary/5'}`}>
                        <span className="text-muted-foreground font-medium">
                          {item.name} <span className="text-[10px] font-mono opacity-50 ml-1">({item.id})</span>
                          {item.foc && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-500/15 px-2 py-1 rounded-full border border-emerald-500/30 whitespace-nowrap leading-none">
                              <Gift className="w-2.5 h-2.5 flex-shrink-0" />
                              {t("bom.focLong")}
                            </span>
                          )}
                          {!item.foc && isMigration && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-500/15 px-2 py-1 rounded-full border border-amber-500/30 whitespace-nowrap leading-none">
                              <DollarSign className="w-2.5 h-2.5 flex-shrink-0" />
                              {t("bom.withCostLong")}
                            </span>
                          )}
                        </span>
                        <span className="font-bold bg-[#a12944] text-white px-3 py-1 rounded-full text-xs whitespace-nowrap leading-none">x{item.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {calculatedBOM.migrationNotes && calculatedBOM.migrationNotes.length > 0 && (
                <div className="col-span-full space-y-2">
                  {calculatedBOM.migrationNotes.map((note, idx) => (
                    <div key={idx} className="flex gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 print:break-inside-avoid">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed text-amber-800 font-medium">
                        {t(note.messageKey)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Opción Alternativa */}
              {calculatedBOM.alternative && (
                <div className="border-2 border-[#0047FF]/20 rounded-xl overflow-hidden bg-white shadow-sm self-start print:break-inside-avoid">
                  <div className="bg-[#0047FF]/5 p-4 border-b border-[#0047FF]/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0047FF]/10 flex items-center justify-center">
                        <Package className="w-4 h-4 text-[#0047FF]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#0047FF]">{t("report.optimizedOption")}</p>
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
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{t("report.doors")}</p>
                        <p className="text-base font-black tier-capacity-number">{calculatedBOM.alternative.selected.maxDoors}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{t("report.users")}</p>
                        <p className="text-base font-black tier-capacity-number">{calculatedBOM.alternative.selected.maxUsers.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{t("report.operators")}</p>
                        <p className="text-base font-black tier-capacity-number">{calculatedBOM.alternative.selected.maxOperators}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-2">{t("report.licenseBreakdown")}</p>
                      {calculatedBOM.alternative.bom.map((item, idx) => (
                        <div key={idx} className={`flex justify-between items-center text-sm py-2 px-3 rounded-md mb-2 ${item.foc ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-muted/10'}`}>
                          <span className="text-muted-foreground font-medium">
                            {item.name} <span className="text-[10px] font-mono opacity-50 ml-1">({item.id})</span>
                            {item.foc && (
                              <span className="ml-2 inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-500/15 px-2 py-1 rounded-full border border-emerald-500/30 whitespace-nowrap leading-none">
                                <Gift className="w-2.5 h-2.5 flex-shrink-0" />
                                {t("bom.focLong")}
                              </span>
                            )}
                            {!item.foc && isMigration && (
                              <span className="ml-2 inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-500/15 px-2 py-1 rounded-full border border-amber-500/30 whitespace-nowrap leading-none">
                                <DollarSign className="w-2.5 h-2.5 flex-shrink-0" />
                                {t("bom.withCostLong")}
                              </span>
                            )}
                          </span>
                          <span className="font-bold bg-muted-foreground/20 text-foreground px-3 py-1 rounded-full text-xs whitespace-nowrap leading-none">x{item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#0047FF]/5 rounded-md border border-[#0047FF]/20 print:break-inside-avoid">
              <p className="text-xs text-foreground leading-relaxed">
                {t("report.purchaseNote")}
              </p>
              <div className="mt-4 pt-4 border-t border-[#0047FF]/10">
                <p className="text-xs text-foreground leading-relaxed">
                  {t("report.contactNote")}
                  {language !== 'en' && (
                    <>
                      {' '}<a href="mailto:latam@supremainc.com" className="text-[#0047FF] font-bold hover:underline">latam@supremainc.com</a>, {t("report.supportNote")}
                    </>
                  )}
                </p>
                <p className="text-xs text-foreground leading-relaxed mt-3 font-semibold">
                  {t("report.closingNote")}
                </p>
                {language !== 'en' && (
                  <p className="text-sm text-[#B12944] font-semibold mt-2 uppercase tracking-tighter">
                    Suprema LATAM — latam@supremainc.com
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 pb-2 border-b border-border">
                {t("report.bom")}
              </h4>
              <div className="space-y-8">
                {/* Tabla Opción Recomendada */}
                <div>
                  <h5 className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-3">
                    {t("report.bomRecommended")} (BioStar X {calculatedBOM.selected.name})
                  </h5>
                  <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{t("report.partNumber")}</th>
                          <th className="text-left py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{t("report.description")}</th>
                          <th className="text-right py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{t("report.quantity")}</th>
                          <th className="text-right py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculatedBOM.bom.map((item, index) => (
                          <tr key={`rec-${item.id}-${index}`} className={`border-b border-border/50 ${item.foc ? 'bg-emerald-500/5' : ''}`}>
                            <td className="py-3 text-xs font-mono font-bold">{item.id}</td>
                            <td className="py-3 text-xs">{item.name}</td>
                            <td className="py-3 text-xs font-bold text-right">{item.qty}</td>
                            <td className="py-3 text-right">
                              {item.foc && (
                                <span className="inline-flex items-center gap-1 text-[8px] font-bold text-emerald-700 bg-emerald-500/15 px-2 py-1 rounded-full border border-emerald-500/30 whitespace-nowrap leading-none">
                                  <Gift className="w-2.5 h-2.5 flex-shrink-0" />
                                  {t("bom.focLong")}
                                </span>
                              )}
                              {!item.foc && isMigration && (
                                <span className="inline-flex items-center gap-1 text-[8px] font-bold text-amber-700 bg-amber-500/15 px-2 py-1 rounded-full border border-amber-500/30 whitespace-nowrap leading-none">
                                  <DollarSign className="w-2.5 h-2.5 flex-shrink-0" />
                                  {t("bom.withCostLong")}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tabla Opción Alternativa */}
                {calculatedBOM.alternative && (
                  <div>
                    <h5 className="text-[10px] font-semibold text-[#0047FF] uppercase tracking-widest mb-3">
                      {t("report.bomOptimized")} (BioStar X {calculatedBOM.alternative.selected.name})
                    </h5>
                    <div className="overflow-x-auto print:overflow-visible">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{t("report.partNumber")}</th>
                            <th className="text-left py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{t("report.description")}</th>
                            <th className="text-right py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{t("report.quantity")}</th>
                            <th className="text-right py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {calculatedBOM.alternative.bom.map((item, index) => (
                            <tr key={`alt-table-${item.id}-${index}`} className={`border-b border-border/50 ${item.foc ? 'bg-emerald-500/5' : ''}`}>
                              <td className="py-3 text-xs font-mono font-bold">{item.id}</td>
                              <td className="py-3 text-xs">{item.name}</td>
                              <td className="py-3 text-xs font-bold text-right">{item.qty}</td>
                              <td className="py-3 text-right">
                                {item.foc && (
                                  <span className="inline-flex items-center gap-1 text-[8px] font-bold text-emerald-700 bg-emerald-500/15 px-2 py-1 rounded-full border border-emerald-500/30 whitespace-nowrap leading-none">
                                    <Gift className="w-2.5 h-2.5 flex-shrink-0" />
                                    {t("bom.focLong")}
                                  </span>
                                )}
                                {!item.foc && isMigration && (
                                  <span className="inline-flex items-center gap-1 text-[8px] font-bold text-amber-700 bg-amber-500/15 px-2 py-1 rounded-full border border-amber-500/30 whitespace-nowrap leading-none">
                                    <DollarSign className="w-2.5 h-2.5 flex-shrink-0" />
                                    {t("bom.withCostLong")}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-[8px] text-muted-foreground text-center leading-relaxed">
                {t("disclaimer.note")}
              </p>
              <p className="text-[8px] text-muted-foreground text-center mt-2">
                {t("report.generated")}: {new Date().toLocaleString(language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES')}
              </p>
              <p className="text-[8px] text-muted-foreground text-center mt-1">
                www.supremainc.com
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 print:hidden">
            <Button variant="outline" onClick={onClose} className="rounded-full">
              {t("report.close")}
            </Button>
            {onSendEmail && (
              <Button variant="outline" onClick={onSendEmail} className="rounded-full gap-2" data-testid="button-send-email-report">
                <Mail className="w-4 h-4" />
                {t("email.send")}
              </Button>
            )}
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
