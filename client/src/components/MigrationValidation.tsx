import { GlassCard } from "@/components/ui/glass-card";
import { FileUpload } from "@/components/FileUpload";
import { Checkbox } from "@/components/ui/checkbox";
import type { ProjectMeta } from "@/types/license";

interface MigrationValidationProps {
  meta: ProjectMeta;
  onChange: (meta: ProjectMeta) => void;
}

export function MigrationValidation({ meta, onChange }: MigrationValidationProps) {
  const updateField = <K extends keyof ProjectMeta>(field: K, value: ProjectMeta[K]) => {
    onChange({ ...meta, [field]: value });
  };

  return (
    <GlassCard className="p-8 sm:p-12 animate-fadeIn">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#0047FF] mb-6 sm:mb-8 pb-4 border-b border-border">
        Validación de Migración BioStar 2
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-10">
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Versión BioStar 2 Actual
          </label>
          <input 
            className="w-full border-b-2 border-muted bg-transparent p-2 font-bold text-base sm:text-lg focus:border-[#0047FF] outline-none transition-all"
            placeholder="Ej: 2.9.x"
            value={meta.bs2Version}
            onChange={e => updateField('bs2Version', e.target.value)}
            data-testid="input-bs2-version"
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Código de Activación Actual
          </label>
          <input 
            className="w-full border-b-2 border-muted bg-transparent p-2 font-bold text-base sm:text-lg focus:border-[#0047FF] outline-none transition-all"
            placeholder="XXXX-XXXX-XXXX-XXXX"
            value={meta.activationCode}
            onChange={e => updateField('activationCode', e.target.value)}
            data-testid="input-activation-code"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <FileUpload 
          label="Captura Dash BioStar 2" 
          fileName={meta.dashboardFile} 
          onChange={n => updateField('dashboardFile', n)} 
          accept="image/*"
        />
        <FileUpload 
          label="Captura Ayuda/Acerca de" 
          fileName={meta.versionFile} 
          onChange={n => updateField('versionFile', n)} 
          accept="image/*"
        />
        <FileUpload 
          label="Archivo Licencia (.lic)" 
          fileName={meta.licenseFile} 
          onChange={n => updateField('licenseFile', n)} 
          accept=".lic"
        />
      </div>
      
      <div className="p-4 sm:p-6 bg-[#0047FF]/5 rounded-md border border-[#0047FF]/20">
        <label className="flex items-start gap-3 sm:gap-4 cursor-pointer group">
          <Checkbox
            checked={meta.hardwareChecked}
            onCheckedChange={(checked) => updateField('hardwareChecked', !!checked)}
            className="mt-1 w-5 h-5 data-[state=checked]:bg-[#0047FF] data-[state=checked]:border-[#0047FF]"
            data-testid="checkbox-hardware"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">
              Confirmación de Compatibilidad de Hardware
            </span>
            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
              Confirmo que he revisado mis equipos y <strong>no cuento con equipos de 1ra Generación</strong>.
            </p>
          </div>
        </label>
      </div>
    </GlassCard>
  );
}
