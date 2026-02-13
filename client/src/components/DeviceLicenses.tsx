import { GlassCard } from "@/components/ui/glass-card";
import { NumericInput } from "@/components/NumericInput";
import { useI18n } from "@/lib/i18n";
import type { ProjectInputs } from "@/types/license";

interface DeviceLicensesProps {
  inputs: ProjectInputs;
  onChange: (inputs: ProjectInputs) => void;
}

export function DeviceLicenses({ inputs, onChange }: DeviceLicensesProps) {
  const { t } = useI18n();
  const updateField = <K extends keyof ProjectInputs>(field: K, value: ProjectInputs[K]) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <GlassCard className="p-8 sm:p-12">
      <h3 className="text-[11px] font-medium font-['Noto_Sans_KR'] uppercase tracking-[0.4em] text-muted-foreground/50 mb-8 sm:mb-10 pb-4 border-b border-border">
        {t("devices.sectionTitle")}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12">
        <NumericInput 
          label={t("devices.videoChannels")} 
          value={inputs.video} 
          onChange={v => updateField('video', v)}
        />
        <NumericInput 
          label={t("devices.qrCameras")} 
          value={inputs.qr} 
          onChange={v => updateField('qr', v)}
        />
        <NumericInput 
          label={t("devices.wirelessLocks")} 
          value={inputs.wireless} 
          onChange={v => updateField('wireless', v)}
        />
      </div>
    </GlassCard>
  );
}
