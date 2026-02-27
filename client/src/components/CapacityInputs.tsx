import { GlassCard } from "@/components/ui/glass-card";
import { NumericInput } from "@/components/NumericInput";
import { useI18n } from "@/lib/i18n";
import { AlertTriangle } from "lucide-react";
import type { ProjectInputs } from "@/types/license";

interface CapacityInputsProps {
  inputs: ProjectInputs;
  onChange: (inputs: ProjectInputs) => void;
  sectionNumber?: number;
}

export function CapacityInputs({ inputs, onChange, sectionNumber = 2 }: CapacityInputsProps) {
  const { t } = useI18n();
  const updateField = <K extends keyof ProjectInputs>(field: K, value: ProjectInputs[K]) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <GlassCard className="p-8 sm:p-12">
      <h3 className="text-base sm:text-lg font-medium font-['Noto_Sans_KR'] text-[#A12944] mb-8 sm:mb-10 flex items-center gap-2">
        <span>{String(sectionNumber).padStart(2, '0')}.</span>
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

      {inputs.doors > 2000 && (
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-md flex items-start gap-3" data-testid="warning-max-doors">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
            {t("validation.maxDoorsExceeded")}
          </p>
        </div>
      )}

      {inputs.devices > 1000 && (
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-md flex items-start gap-3" data-testid="warning-max-devices">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
            {t("validation.maxDevicesExceeded")}
          </p>
        </div>
      )}
    </GlassCard>
  );
}
