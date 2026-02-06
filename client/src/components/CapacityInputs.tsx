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
      <h3 className="text-base sm:text-lg font-heading font-black text-[#A12944] mb-8 sm:mb-10 flex items-center gap-2">
        <span className="opacity-20 text-xs sm:text-sm">02.</span>
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
        />
      </div>
    </GlassCard>
  );
}
