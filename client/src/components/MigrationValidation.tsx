import { GlassCard } from "@/components/ui/glass-card";
import { FileUpload } from "@/components/FileUpload";
import { Checkbox } from "@/components/ui/checkbox";
import { useI18n } from "@/lib/i18n";
import { MIGRATION_MAPPING } from "@/data/licenseData";
import type { ProjectMeta } from "@/types/license";

interface MigrationValidationProps {
  meta: ProjectMeta;
  onChange: (meta: ProjectMeta) => void;
}

export function MigrationValidation({ meta, onChange }: MigrationValidationProps) {
  const { t } = useI18n();
  const updateField = <K extends keyof ProjectMeta>(field: K, value: ProjectMeta[K]) => {
    onChange({ ...meta, [field]: value });
  };

  const handleTierChange = (val: string) => {
    updateField('activationCode', val);
    // Also trigger update on inputs if needed, though Calculator.tsx handles the effect
  };

  return (
    <GlassCard className="p-8 sm:p-12 animate-fadeIn">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#0047FF] mb-6 sm:mb-8 pb-4 border-b border-border">
        {t("migration.sectionTitle")}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-10">
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
            {t("migration.currentVersion")}
          </label>
          <input 
            className="w-full border-b-2 border-muted bg-transparent p-2 font-bold text-base sm:text-lg focus:border-[#0047FF] outline-none transition-all"
            placeholder={t("migration.versionPlaceholder")}
            value={meta.bs2Version}
            onChange={e => updateField('bs2Version', e.target.value)}
            data-testid="input-bs2-version"
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
            {t("migration.currentActivation")} (BioStar 2 Tier)
          </label>
          <select 
            className="w-full border-b-2 border-muted bg-transparent p-2 font-bold text-base sm:text-lg focus:border-[#0047FF] outline-none transition-all cursor-pointer"
            value={meta.activationCode}
            onChange={e => handleTierChange(e.target.value)}
            data-testid="select-bs2-tier"
          >
            <option value="">{t("migration.selectLicense")}</option>
            {Object.keys(MIGRATION_MAPPING.AC).map(tier => (
              <option key={tier} value={tier}>
                {tier === 'BioStar2-Starter' ? 'Starter (Free)' : tier.replace('BioStar2-', '')}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <FileUpload 
          label={t("migration.dashCapture")} 
          fileName={meta.dashboardFile} 
          onChange={n => updateField('dashboardFile', n)} 
          accept="image/*"
        />
        <FileUpload 
          label={t("migration.helpCapture")} 
          fileName={meta.versionFile} 
          onChange={n => updateField('versionFile', n)} 
          accept="image/*"
        />
        <FileUpload 
          label={t("migration.licenseFile")} 
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
              {t("migration.hardwareConfirmation")}
            </span>
            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
              {t("migration.hardwareConfirmDesc")}
            </p>
          </div>
        </label>
      </div>
    </GlassCard>
  );
}
