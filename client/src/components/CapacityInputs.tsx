import { GlassCard } from "@/components/ui/glass-card";
import { NumericInput } from "@/components/NumericInput";
import { useI18n } from "@/lib/i18n";
import type { ProjectInputs } from "@/types/license";

interface CapacityInputsProps {
  inputs: ProjectInputs;
  onChange: (inputs: ProjectInputs) => void;
}

export function CapacityInputs({ inputs, onChange }: CapacityInputsProps) {
  const { t } = useI18n();
  const updateField = <K extends keyof ProjectInputs>(field: K, value: ProjectInputs[K]) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <GlassCard className="p-8 sm:p-12">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50 mb-8 sm:mb-10 pb-4 border-b border-border">
        {t("capacity.sectionTitle")}
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12">
        <NumericInput 
          label={t("capacity.totalUsers")} 
          value={inputs.users} 
          onChange={v => updateField('users', v)}
        />
        <NumericInput 
          label={t("capacity.totalDoors")} 
          value={inputs.doors} 
          onChange={v => updateField('doors', v)}
        />
        <NumericInput 
          label={t("capacity.totalDevices")} 
          value={inputs.devices} 
          onChange={v => updateField('devices', v)}
        />
        <NumericInput 
          label={t("capacity.simultOperators")} 
          value={inputs.operators} 
          onChange={v => updateField('operators', v)}
          min={1}
        />
      </div>
    </GlassCard>
  );
}
