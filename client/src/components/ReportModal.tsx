import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PillButton } from "@/components/ui/pill-button";
import { Printer, Copy, X, CheckCircle, Download } from "lucide-react";
import { useState } from "react";
import { DISCLAIMER } from "@/data/licenseData";
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
  
  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const bomText = bom.map(item => `${item.id} - ${item.name} x${item.qty}`).join('\n');
    const text = `
REPORTE MAESTRO - BioStar X Mapper
===================================

PROYECTO: ${meta.projectName || 'Sin nombre'}
CLIENTE: ${meta.client || 'Sin especificar'}
PAÍS: ${meta.country || 'Sin especificar'}
TIPO: ${meta.clientType}
ESCENARIO: ${inputs.scenario === 'migration' ? 'Migración BioStar 2' : 'Proyecto Nuevo'}

CONTACTO
--------
${meta.contactFirst} ${meta.contactLast}
${meta.email}
${meta.phone}

DIMENSIONAMIENTO
----------------
Usuarios: ${inputs.users}
Puertas: ${inputs.doors}
Dispositivos: ${inputs.devices}
Operadores: ${inputs.operators}

TIER RECOMENDADO
----------------
BioStar X ${selected.name}
- Máx. Puertas: ${selected.maxDoors}
- Máx. Usuarios: ${selected.maxUsers.toLocaleString()}
- Máx. Operadores: ${selected.maxOperators}

BILL OF MATERIALS
-----------------
${bomText}

---
${DISCLAIMER}
    `.trim();
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['Part Number', 'Descripcion', 'Cantidad'];
    const rows = bom.map(item => [item.id, item.name, item.qty.toString()]);
    const csvContent = [
      `# Proyecto: ${meta.projectName}`,
      `# Cliente: ${meta.client}`,
      `# Tier: BioStar X ${selected.name}`,
      `# Fecha: ${new Date().toLocaleDateString('es-ES')}`,
      '',
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BioStarX_BOM_${meta.projectName.replace(/\s+/g, '_') || 'proyecto'}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
                Reporte Maestro
              </DialogTitle>
              <DialogDescription className="sr-only">
                Resumen del proyecto y Bill of Materials calculado
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
                src="https://www.supremainc.com/es/images/logo.png" 
                alt="Suprema Logo"
                className="h-6 grayscale opacity-80" 
              />
              <div className="h-6 w-px bg-border" />
              <span className="text-sm font-heading font-bold uppercase tracking-tight">
                BioStar <span className="text-[#A12944] italic">X</span> Mapper
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-2">
                  Información del Proyecto
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Proyecto:</span>
                    <span className="text-xs font-bold">{meta.projectName || 'Sin nombre'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Cliente:</span>
                    <span className="text-xs font-bold">{meta.client || 'Sin especificar'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">País:</span>
                    <span className="text-xs font-bold">{meta.country || 'Sin especificar'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Tipo:</span>
                    <span className="text-xs font-bold">{meta.clientType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Escenario:</span>
                    <span className="text-xs font-bold">
                      {inputs.scenario === 'migration' ? 'Migración BioStar 2' : 'Proyecto Nuevo'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-2">
                  Datos de Contacto
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Nombre:</span>
                    <span className="text-xs font-bold">{meta.contactFirst} {meta.contactLast}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Email:</span>
                    <span className="text-xs font-bold">{meta.email || 'Sin especificar'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Teléfono:</span>
                    <span className="text-xs font-bold">{meta.phone || 'Sin especificar'}</span>
                  </div>
                </div>
              </div>
            </div>

            {inputs.scenario === 'migration' && (
              <div className="p-4 bg-[#0047FF]/5 rounded-md border border-[#0047FF]/20">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0047FF] mb-3">
                  Validación de Migración
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Versión BS2:</span>
                    <span className="text-xs font-bold">{meta.bs2Version || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Código Activación:</span>
                    <span className="text-xs font-bold font-mono">{meta.activationCode || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Hardware 1ra Gen:</span>
                    <span className="text-xs font-bold">{meta.hardwareChecked ? 'Verificado OK' : 'No verificado'}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-md">
              <div className="text-center">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Usuarios</p>
                <p className="text-2xl font-heading font-black text-foreground">{inputs.users.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Puertas</p>
                <p className="text-2xl font-heading font-black text-foreground">{inputs.doors}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Dispositivos</p>
                <p className="text-2xl font-heading font-black text-foreground">{inputs.devices}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Operadores</p>
                <p className="text-2xl font-heading font-black text-foreground">{inputs.operators}</p>
              </div>
            </div>

            {activeFeatures.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Funciones Seleccionadas
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

            <div className="bg-gradient-to-br from-[#00C2FF]/10 via-[#0047FF]/10 to-[#FF00E5]/10 rounded-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-heading font-black">
                  Tier Recomendado: <span className="text-[#0047FF]">BioStar X {selected.name}</span>
                </h4>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-white/50 dark:bg-card/50 rounded-md">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">Máx. Puertas</p>
                  <p className="text-xl font-black">{selected.maxDoors}</p>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-card/50 rounded-md">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">Máx. Usuarios</p>
                  <p className="text-xl font-black">{selected.maxUsers.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-card/50 rounded-md">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">Máx. Ops</p>
                  <p className="text-xl font-black">{selected.maxOperators}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0047FF]/5 rounded-md border border-[#0047FF]/20">
              <p className="text-xs text-foreground leading-relaxed">
                A continuación, compartimos los códigos de parte correspondientes para la consideración de compra de BioStar X. Estos códigos permitirán identificar correctamente las licencias y componentes necesarios según la configuración del proyecto.
              </p>
              <p className="text-xs text-foreground leading-relaxed mt-3">
                Para cualquier duda, validación o seguimiento del proceso de compra, por favor contactar a nuestro equipo de LATAM a través de{' '}
                <a href="mailto:latam@supremainc.com" className="text-[#0047FF] font-bold hover:underline">latam@supremainc.com</a>, quienes con gusto les brindarán el apoyo necesario.
              </p>
              <p className="text-xs text-foreground leading-relaxed mt-3 font-bold">
                Quedamos atentos para acompañarlos en el proceso.
              </p>
              <p className="text-xs text-[#A12944] font-bold mt-2">
                Suprema LATAM — latam@supremainc.com
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 pb-2 border-b border-border">
                Bill of Materials (BOM)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Part Number</th>
                      <th className="text-left py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Descripción</th>
                      <th className="text-right py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Cantidad</th>
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
                {DISCLAIMER}
              </p>
              <p className="text-[8px] text-muted-foreground text-center mt-2">
                Generado: {new Date().toLocaleString('es-ES')}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 print:hidden">
            <Button variant="outline" onClick={onClose} className="rounded-full">
              Cerrar
            </Button>
            <PillButton onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir / PDF
            </PillButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
