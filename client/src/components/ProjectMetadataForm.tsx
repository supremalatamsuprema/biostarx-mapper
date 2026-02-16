import { GlassCard } from "@/components/ui/glass-card";
import { Checkbox } from "@/components/ui/checkbox";
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-6 sm:gap-y-8">
        {/* Project Details */}
        <div className="space-y-5 sm:space-y-6">
          <div className="space-y-1">
            <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
              {t("projectMeta.projectName")}
            </label>
            <input 
              className="w-full border-b-2 border-muted bg-transparent p-2 font-bold text-base sm:text-lg focus:border-[#A12944] outline-none transition-all"
              value={meta.projectName}
              onChange={e => updateField('projectName', e.target.value)}
              data-testid="input-project-name"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
              {t("projectMeta.client")}
            </label>
            <input 
              className="w-full border-b-2 border-muted bg-transparent p-2 font-bold text-base sm:text-lg focus:border-[#A12944] outline-none transition-all"
              value={meta.client}
              onChange={e => updateField('client', e.target.value)}
              data-testid="input-client"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                {t("projectMeta.country")}
              </label>
              <input 
                className="w-full border-b-2 border-muted bg-transparent p-2 font-bold text-base sm:text-lg focus:border-[#A12944] outline-none transition-all"
                value={meta.country}
                onChange={e => updateField('country', e.target.value)}
                data-testid="input-country"
              />
            </div>
            
            <div className="flex flex-col border-b-2 border-muted focus-within:border-[#A12944] transition-all text-[12px]">
              <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                {t("projectMeta.clientType")}
              </label>
              <select 
                className="bg-transparent p-2 font-medium font-['Noto_Sans_KR'] text-[14px] outline-none cursor-pointer"
                value={meta.clientType}
                onChange={e => updateField('clientType', e.target.value)}
                data-testid="select-client-type"
              >
                <option value="Integrador" className="text-black bg-white">{t("clientType.integrator")}</option>
                <option value="Dealer" className="text-black bg-white">{t("clientType.dealer")}</option>
                <option value="Distribuidor" className="text-black bg-white">{t("clientType.distributor")}</option>
                <option value="Cliente Final" className="text-black bg-white">{t("clientType.endClient")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-5 sm:space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                {t("projectMeta.firstName")}
              </label>
              <input 
                className="w-full border-b-2 border-muted bg-transparent p-2 font-bold text-base sm:text-lg focus:border-[#A12944] outline-none transition-all"
                value={meta.contactFirst}
                onChange={e => updateField('contactFirst', e.target.value)}
                data-testid="input-contact-first"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                {t("projectMeta.lastName")}
              </label>
              <input 
                className="w-full border-b-2 border-muted bg-transparent p-2 font-bold text-base sm:text-lg focus:border-[#A12944] outline-none transition-all"
                value={meta.contactLast}
                onChange={e => updateField('contactLast', e.target.value)}
                data-testid="input-contact-last"
              />
            </div>
          </div>
          
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
          
          <div className="space-y-1">
            <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
              {t("projectMeta.phone")}
            </label>
            <input 
              type="tel"
              className="w-full border-b-2 border-muted bg-transparent p-2 font-bold text-base sm:text-lg focus:border-[#A12944] outline-none transition-all"
              value={meta.phone}
              onChange={e => updateField('phone', e.target.value)}
              data-testid="input-phone"
            />
          </div>
        </div>
      </div>
      <div className="mt-8 sm:mt-10 p-4 sm:p-5 bg-muted/30 rounded-md border border-border">
        <label className="flex items-center gap-3 sm:gap-4 cursor-pointer group">
          <Checkbox
            checked={meta.authorized}
            onCheckedChange={(checked) => updateField('authorized', !!checked)}
            className="w-5 h-5"
            data-testid="checkbox-authorization"
          />
          <div className="flex flex-col">
            <span className="text-sm text-foreground font-medium">
              {t("projectMeta.dataAuth")}
            </span>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
              {t("projectMeta.dataAuthDesc")}
            </p>
          </div>
        </label>
      </div>
    </GlassCard>
  );
}
