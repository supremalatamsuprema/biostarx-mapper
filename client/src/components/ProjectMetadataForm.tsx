import { GlassCard } from "@/components/ui/glass-card";
import { Checkbox } from "@/components/ui/checkbox";
import { CLIENT_TYPES } from "@/data/licenseData";
import type { ProjectMeta } from "@/types/license";

interface ProjectMetadataFormProps {
  meta: ProjectMeta;
  onChange: (meta: ProjectMeta) => void;
}

export function ProjectMetadataForm({ meta, onChange }: ProjectMetadataFormProps) {
  const updateField = <K extends keyof ProjectMeta>(field: K, value: ProjectMeta[K]) => {
    onChange({ ...meta, [field]: value });
  };

  return (
    <GlassCard className="p-8 sm:p-12">
      <h3 className="text-xl sm:text-2xl font-heading font-black text-foreground mb-6 sm:mb-8">
        Identificación del Proyecto
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-8 sm:gap-y-10">
        <div className="space-y-6 sm:space-y-8">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 pb-2 border-b border-border">
            Detalles del Proyecto
          </h4>
          
          <div className="space-y-5 sm:space-y-6">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Nombre del Proyecto
              </label>
              <input 
                className="w-full border-b-2 border-muted bg-transparent p-2 font-bold text-base sm:text-lg focus:border-[#A12944] outline-none transition-all"
                value={meta.projectName}
                onChange={e => updateField('projectName', e.target.value)}
                data-testid="input-project-name"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Cliente Final / Empresa
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
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                  País / Región
                </label>
                <input 
                  className="w-full border-b-2 border-muted bg-transparent p-2 font-bold text-base sm:text-lg focus:border-[#A12944] outline-none transition-all"
                  value={meta.country}
                  onChange={e => updateField('country', e.target.value)}
                  data-testid="input-country"
                />
              </div>
              
              <div className="flex flex-col border-b-2 border-muted focus-within:border-[#A12944] transition-all">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                  Tipo de Cliente
                </label>
                <select 
                  className="bg-transparent p-2 font-bold text-base sm:text-lg outline-none cursor-pointer"
                  value={meta.clientType}
                  onChange={e => updateField('clientType', e.target.value)}
                  data-testid="select-client-type"
                >
                  {CLIENT_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 pb-2 border-b border-border">
            Datos del Contacto
          </h4>
          
          <div className="space-y-5 sm:space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                  Nombre
                </label>
                <input 
                  className="w-full border-b-2 border-muted bg-transparent p-2 font-bold text-base sm:text-lg focus:border-[#A12944] outline-none transition-all"
                  value={meta.contactFirst}
                  onChange={e => updateField('contactFirst', e.target.value)}
                  data-testid="input-contact-first"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                  Apellido
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
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Correo Electrónico
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
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Teléfono
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
      </div>

      <div className="mt-10 sm:mt-12 p-4 sm:p-6 bg-muted/30 rounded-md border border-border">
        <label className="flex items-center gap-3 sm:gap-4 cursor-pointer group">
          <Checkbox
            checked={meta.authorized}
            onCheckedChange={(checked) => updateField('authorized', !!checked)}
            className="w-5 h-5"
            data-testid="checkbox-authorization"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">
              Autorización de Tratamiento de Datos
            </span>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
              Acepto el tratamiento de mis datos personales según la política de privacidad de Suprema Inc.
            </p>
          </div>
        </label>
      </div>
    </GlassCard>
  );
}
