import { GlassCard } from "@/components/ui/glass-card";
import { useI18n } from "@/lib/i18n";
import type { ProjectMeta } from "@/types/license";

interface ProjectMetadataFormProps {
  meta: ProjectMeta;
  onChange: (meta: ProjectMeta) => void;
}

export function ProjectMetadataForm({ meta, onChange }: ProjectMetadataFormProps) {
  const { t } = useI18n();
  const updateField = <K extends keyof ProjectMeta>(field: K, value: ProjectMeta[K]) => {
    onChange({ ...meta, [field]: value });
  };

  return (
    <GlassCard className="p-8 sm:p-10">
      <h3 className="text-base sm:text-lg font-medium font-['Noto_Sans_KR'] text-[#A12944] mb-6 sm:mb-8 flex items-center gap-2">
        <span>01.</span>
        {t("projectMeta.title")}
      </h3>
      <div className="max-w-md">
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
            {t("projectMeta.email")}
          </label>
          <input
            type="email"
            className="w-full border-b-2 border-muted bg-transparent p-2 font-bold text-base sm:text-lg focus:border-[#A12944] outline-none transition-all"
            value={meta.email}
            onChange={e => updateField('email', e.target.value)}
            data-testid="input-email"
          />
        </div>
      </div>
    </GlassCard>
  );
}
