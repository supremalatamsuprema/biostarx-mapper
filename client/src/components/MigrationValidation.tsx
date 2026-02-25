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

  const cloudAppEligible = ['BioStar2-Standard', 'BioStar2-Advanced', 'BioStar2-Professional', 'BioStar2-Enterprise'];
  const showCloudApp = cloudAppEligible.includes(meta.activationCode);

  const handleTierChange = (val: string) => {
    const newMeta = { ...meta, activationCode: val };
    if (!cloudAppEligible.includes(val)) {
      newMeta.bs2UsesCloud = false;
      newMeta.bs2UsesApp = false;
      newMeta.bs2AppSameNetwork = false;
      newMeta.bs2AppOutsideNetwork = false;
    }
    onChange(newMeta);
  };

  return (
    <GlassCard className="p-8 sm:p-12 animate-fadeIn">
      <h3 className="text-base sm:text-lg font-medium font-['Noto_Sans_KR'] text-[#A12944] mb-6 sm:mb-8 pb-4 border-b border-border flex items-center gap-2">
        <span>02.</span>
        {t("migration.sectionTitle")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-10">
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
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
          <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
            {t("migration.acLicenseLabel")}
          </label>
          <select 
            className="w-full border-b-2 border-muted bg-transparent p-2 font-bold text-base sm:text-lg focus:border-[#0047FF] outline-none transition-all cursor-pointer"
            value={meta.activationCode}
            onChange={e => handleTierChange(e.target.value)}
            data-testid="select-bs2-tier"
          >
            <option value="" className="text-black bg-white">{t("migration.selectLicense")}</option>
            {Object.keys(MIGRATION_MAPPING.AC).map(tier => {
              const mapping = (MIGRATION_MAPPING.AC as any)[tier];
              const label = tier.replace('BioStar2-', '');
              const suffix = mapping.noMigration ? ' (N/A)' : '';
              return (
                <option key={tier} value={tier} className="text-black bg-white">
                  {label}{suffix}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-10">
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
            {t("migration.taLicenseLabel")}
          </label>
          <select 
            className="w-full border-b-2 border-muted bg-transparent p-2 font-bold text-base sm:text-lg focus:border-[#0047FF] outline-none transition-all cursor-pointer"
            value={meta.bs2TaLicense}
            onChange={e => updateField('bs2TaLicense', e.target.value)}
            data-testid="select-bs2-ta"
          >
            <option value="" className="text-black bg-white">{t("migration.noLicense")}</option>
            {Object.keys(MIGRATION_MAPPING.TA).map(tier => {
              const mapping = (MIGRATION_MAPPING.TA as any)[tier];
              const label = tier.replace('BioStar2-TA-', '');
              const suffix = mapping.noMigration ? ' (N/A)' : '';
              return (
                <option key={tier} value={tier} className="text-black bg-white">
                  {label}{suffix}
                </option>
              );
            })}
          </select>
        </div>
        
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
            {t("migration.visitorLicenseLabel")}
          </label>
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={meta.bs2VisitorLicense}
                onCheckedChange={(checked) => updateField('bs2VisitorLicense', !!checked)}
                className="w-5 h-5 data-[state=checked]:bg-[#0047FF] data-[state=checked]:border-[#0047FF]"
                data-testid="checkbox-bs2-visitor"
              />
              <span className="text-sm font-bold text-foreground">
                {t("migration.hasVisitorLicense")}
              </span>
            </label>
          </div>
        </div>
      </div>
      {showCloudApp && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-10 animate-fadeIn">
          <div className="space-y-1">
            <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
              {t("migration.cloudAppLabel")}
            </label>
            <div className="pt-2 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={meta.bs2UsesCloud}
                  onCheckedChange={(checked) => updateField('bs2UsesCloud', !!checked)}
                  className="w-5 h-5 data-[state=checked]:bg-[#0047FF] data-[state=checked]:border-[#0047FF]"
                  data-testid="checkbox-bs2-cloud"
                />
                <span className="text-sm font-bold text-foreground">
                  {t("migration.usesCloud")}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={meta.bs2UsesApp}
                  onCheckedChange={(checked) => {
                    const newMeta = { ...meta, bs2UsesApp: !!checked };
                    if (!checked) {
                      newMeta.bs2AppSameNetwork = false;
                      newMeta.bs2AppOutsideNetwork = false;
                    }
                    onChange(newMeta);
                  }}
                  className="w-5 h-5 data-[state=checked]:bg-[#0047FF] data-[state=checked]:border-[#0047FF]"
                  data-testid="checkbox-bs2-app"
                />
                <span className="text-sm font-bold text-foreground">
                  {t("migration.usesApp")}
                </span>
              </label>
              {meta.bs2UsesApp && (
                <div className="ml-8 space-y-2 animate-fadeIn">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={meta.bs2AppSameNetwork}
                      onCheckedChange={(checked) => updateField('bs2AppSameNetwork', !!checked)}
                      className="w-4 h-4 data-[state=checked]:bg-[#0047FF] data-[state=checked]:border-[#0047FF]"
                      data-testid="checkbox-bs2-app-same-network"
                    />
                    <span className="text-sm text-foreground">
                      {t("migration.appSameNetwork")}
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={meta.bs2AppOutsideNetwork}
                      onCheckedChange={(checked) => updateField('bs2AppOutsideNetwork', !!checked)}
                      className="w-4 h-4 data-[state=checked]:bg-[#0047FF] data-[state=checked]:border-[#0047FF]"
                      data-testid="checkbox-bs2-app-outside-network"
                    />
                    <span className="text-sm text-foreground">
                      {t("migration.appOutsideNetwork")}
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <FileUpload 
          label={t("migration.dashCapture")} 
          fileName={meta.dashboardFile} 
          onChange={(n, data) => { updateField('dashboardFile', n); updateField('dashboardFileData', data || ''); }} 
          accept="image/*"
        />
        <FileUpload 
          label={t("migration.helpCapture")} 
          fileName={meta.versionFile} 
          onChange={(n, data) => { updateField('versionFile', n); updateField('versionFileData', data || ''); }} 
          accept="image/*"
        />
        <FileUpload 
          label={t("migration.licenseFile")} 
          fileName={meta.licenseFile} 
          onChange={(n, data) => { updateField('licenseFile', n); updateField('licenseFileData', data || ''); }} 
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
