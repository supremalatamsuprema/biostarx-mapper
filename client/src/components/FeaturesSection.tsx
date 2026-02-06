import { GlassCard } from "@/components/ui/glass-card";
import { FeatureToggle } from "@/components/FeatureToggle";
import { NumericInput } from "@/components/NumericInput";
import { ADVANCED_AC_FEATURES } from "@/data/licenseData";
import { Checkbox } from "@/components/ui/checkbox";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import type { ProjectInputs, FeatureFlags } from "@/types/license";

interface FeaturesSectionProps {
  inputs: ProjectInputs;
  features: FeatureFlags;
  onInputsChange: (inputs: ProjectInputs) => void;
  onFeaturesChange: (features: FeatureFlags) => void;
  bs2VisitorLocked?: boolean;
  bs2TnaLocked?: boolean;
}

export function FeaturesSection({ 
  inputs, 
  features, 
  onInputsChange, 
  onFeaturesChange,
  bs2VisitorLocked = false,
  bs2TnaLocked = false
}: FeaturesSectionProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const updateFeature = <K extends keyof FeatureFlags>(field: K, value: boolean) => {
    if (field === 'visitor' && !value && bs2VisitorLocked) {
      toast({
        title: t("validation.cannotUncheck"),
        description: t("validation.visitorLockedByMigration"),
        variant: "destructive"
      });
      return;
    }
    if (field === 'tna' && !value && bs2TnaLocked) {
      toast({
        title: t("validation.cannotUncheck"),
        description: t("validation.tnaLockedByMigration"),
        variant: "destructive"
      });
      return;
    }
    onFeaturesChange({ ...features, [field]: value });
  };

  return (
    <GlassCard className="p-8 sm:p-12">
      <div className="flex justify-between items-start mb-8 sm:mb-10 pb-4 border-b border-border">
        <h3 className="sm:text-2xl font-heading text-foreground text-[18px] font-normal">
          {t("features.sectionTitle")}
        </h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        <div className="space-y-4 sm:space-y-6">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#A12944]">
            {t("features.advancedAC")}
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ADVANCED_AC_FEATURES.map(f => (
              <label 
                key={f.id}
                className="flex items-center gap-3 p-2 rounded-md cursor-pointer group hover-elevate"
              >
                <Checkbox
                  checked={features[f.id as keyof FeatureFlags]}
                  onCheckedChange={(checked) => updateFeature(f.id as keyof FeatureFlags, !!checked)}
                  className="w-4 h-4 data-[state=checked]:bg-[#A12944] data-[state=checked]:border-[#A12944]"
                  data-testid={`checkbox-${f.id}`}
                />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {t(`advancedFeature.${f.id}`)}
                </span>
              </label>
            ))}
          </div>
          
          <p className="font-bold text-muted-foreground italic text-[12px]">
            {t("features.advancedNote")}
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground">
            {t("features.modulesAddons")}
          </h4>
          
          <div className="flex flex-col gap-2">
            <FeatureToggle 
              label={t("features.graphicMaps")} 
              checked={features.maps} 
              onChange={v => updateFeature('maps', v)}
            />
            <FeatureToggle 
              label={t("features.visitors")} 
              checked={features.visitor} 
              onChange={v => updateFeature('visitor', v)}
            />
            
            <div className="flex flex-col">
              <FeatureToggle 
                label={t("features.timeAttendance")} 
                checked={features.tna} 
                onChange={v => updateFeature('tna', v)}
              />
              {features.tna && (
                <div className="ml-6 sm:ml-8 mt-2 animate-fadeIn p-4 bg-muted/50 rounded-md">
                  <NumericInput 
                    label={t("features.tnaUsersLabel")} 
                    value={inputs.tnaUsers} 
                    onChange={v => onInputsChange({ ...inputs, tnaUsers: v })}
                  />
                </div>
              )}
            </div>
            
            <FeatureToggle 
              label={t("features.mobileAccess")} 
              checked={features.mobile} 
              onChange={v => updateFeature('mobile', v)}
            />
            <FeatureToggle 
              label={t("features.apiSupport")} 
              checked={features.api} 
              onChange={v => updateFeature('api', v)}
            />
            <FeatureToggle 
              label={t("features.directory")} 
              checked={features.directory} 
              onChange={v => updateFeature('directory', v)}
            />
            <FeatureToggle 
              label={t("features.remoteAccess")} 
              checked={features.remote} 
              onChange={v => updateFeature('remote', v)}
            />
            <FeatureToggle 
              label={t("features.eventApi")} 
              checked={features.eventApi} 
              onChange={v => updateFeature('eventApi', v)}
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
