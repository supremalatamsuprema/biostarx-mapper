import { LICENSE_TIERS, ADDONS, MIGRATION_MAPPING } from "@/data/licenseData";
import type { 
  ProjectInputs, 
  FeatureFlags, 
  CalculatedBOM, 
  BomItem,
  LicenseTier,
  MigrationNote
} from "@/types/license";

export function getMigrationEquivalent(bs2Tier: string, type: 'AC' | 'TA' | 'VISITOR'): any {
  return (MIGRATION_MAPPING as any)[type]?.[bs2Tier];
}

export function needsAdvancedPackage(features: FeatureFlags): boolean {
  return features.globalApb || features.fire || features.elevator || 
         features.interlock || features.intrusion || features.mustering || 
         features.occupancy;
}

const BS2_DOOR_LIMITS: Record<string, number> = {
  'BioStar2-Starter': 5,
  'BioStar2-Basic': 20,
  'BioStar2-Standard': 50,
  'BioStar2-Advanced': 100,
  'BioStar2-Professional': 300,
  'BioStar2-Enterprise': 1000,
};

const TIER_ORDER = ['BIOSTARX-DEV', 'BIOSTARX-STR', 'BIOSTARX-ESS', 'BIOSTARX-ADV', 'BIOSTARX-ENT', 'BIOSTARX-ELT'];

function tierIndex(tierId: string): number {
  return TIER_ORDER.indexOf(tierId);
}

export function calculateBOM(inputs: ProjectInputs, features: FeatureFlags): CalculatedBOM {
  const reqD = inputs.doors;
  const reqO = inputs.operators;
  const needsAdvPkg = needsAdvancedPackage(features);

  const effectiveUsers = features.tna 
    ? Math.max(inputs.users, inputs.tnaUsers || 0)
    : inputs.users;

  const reqU = effectiveUsers;

  const isMigration = inputs.scenario === 'migration';
  const acCode = inputs.activationCode || '';
  const acMapping = isMigration && acCode ? (MIGRATION_MAPPING.AC as any)[acCode] : null;
  const isStarterNoMigration = acMapping?.noMigration === true;

  function isFocFromMigration(addonKey: string): boolean {
    if (!isMigration || !acMapping || isStarterNoMigration) return false;
    return acMapping.addons?.includes(addonKey) || false;
  }

  function getBomForTier(selectedTier: LicenseTier): BomItem[] {
    const bom: BomItem[] = [];

    const baseFoc = isMigration && acMapping && !isStarterNoMigration && acMapping.base
      ? selectedTier.id === acMapping.base
      : false;
    bom.push({ id: selectedTier.id, name: `BioStar X ${selectedTier.name}`, qty: 1, foc: baseFoc || undefined });

    if (selectedTier.id !== 'BIOSTARX-STR' && reqU > selectedTier.maxUsers) {
      const uGap = reqU - selectedTier.maxUsers;
      bom.push({ ...ADDONS.USR_UP, qty: Math.ceil(uGap / 5000) });
    }

    if (selectedTier.id !== 'BIOSTARX-DEV') {
      const effectiveDoors = isMigration && acCode
        ? Math.max(reqD, BS2_DOOR_LIMITS[acCode] || 0)
        : reqD;

      const dGap = Math.max(0, effectiveDoors - selectedTier.maxDoors);
      if (dGap > 0) {
        bom.push({ ...ADDONS.DOOR_UP, qty: Math.ceil(dGap / 32) });
      }
    }

    const oGap = Math.max(0, reqO - selectedTier.maxOperators);
    if (oGap > 0) {
      bom.push({ ...ADDONS.OP_UP, qty: Math.ceil(oGap / 10) });
    }

    const aacFoc = isFocFromMigration('ADV_AC');
    if (needsAdvPkg && selectedTier.id !== 'BIOSTARX-ENT' && selectedTier.id !== 'BIOSTARX-ELT') {
      if (!bom.find(b => b.id === ADDONS.ADV_AC.id)) {
        bom.push({ ...ADDONS.ADV_AC, qty: 1, foc: aacFoc || undefined });
      }
    }

    if (isMigration && acMapping && !isStarterNoMigration && acMapping.addons) {
      acMapping.addons.forEach((addonKey: string) => {
        if (addonKey === 'ADV_AC') {
          if (selectedTier.id === 'BIOSTARX-ENT' || selectedTier.id === 'BIOSTARX-ELT') return;
          const existing = bom.find(b => b.id === ADDONS.ADV_AC.id);
          if (existing) {
            existing.foc = true;
          } else {
            bom.push({ ...ADDONS.ADV_AC, qty: 1, foc: true });
          }
          return;
        }
        const addon = (ADDONS as any)[addonKey];
        if (addon) {
          const existing = bom.find(b => b.id === addon.id);
          if (existing) {
            existing.foc = true;
          } else {
            bom.push({ ...addon, qty: 1, foc: true });
          }
        }
      });
    }

    if (features.visitor) {
      if (!bom.find(b => b.id === ADDONS.VISITOR.id)) {
        const visitorFoc = isMigration && inputs.bs2VisitorLicense ? true : undefined;
        bom.push({ ...ADDONS.VISITOR, qty: 1, foc: visitorFoc });
      }
    }

    if (features.tna) {
      if (isMigration && inputs.bs2TaLicense) {
        const taMapping = (MIGRATION_MAPPING.TA as any)[inputs.bs2TaLicense];
        if (taMapping && !taMapping.noMigration) {
          const tnaUsers = inputs.tnaUsers || reqU;
          const mappedAddonKey = taMapping.addon;
          const mappedIsStandard = mappedAddonKey === 'TNA_STD';
          const needsUpgrade = mappedIsStandard && tnaUsers > 500;

          if (needsUpgrade) {
            if (!bom.find(b => b.id === ADDONS.TNA_ENT.id)) {
              bom.push({ ...ADDONS.TNA_ENT, qty: 1 });
            }
          } else {
            const addon = (ADDONS as any)[mappedAddonKey];
            if (addon && !bom.find(b => b.id === addon.id)) {
              bom.push({ ...addon, qty: 1, foc: true });
            }
          }
        } else if (taMapping?.noMigration) {
          const tnaUsers = inputs.tnaUsers || reqU;
          const tnaAddon = tnaUsers > 500 ? ADDONS.TNA_ENT : ADDONS.TNA_STD;
          if (!bom.find(b => b.id === tnaAddon.id)) {
            bom.push({ ...tnaAddon, qty: 1 });
          }
        }
      } else {
        const tnaUsers = inputs.tnaUsers || reqU;
        const tnaAddon = tnaUsers > 500 ? ADDONS.TNA_ENT : ADDONS.TNA_STD;
        if (!bom.find(b => b.id === tnaAddon.id)) {
          bom.push({ ...tnaAddon, qty: 1 });
        }
      }
    }

    if (features.mobile) bom.push({ ...ADDONS.MOBILE, qty: 1 });
    if (features.directory) {
      if (!bom.find(b => b.id === ADDONS.DIR.id)) {
        bom.push({ ...ADDONS.DIR, qty: 1 });
      }
    }
    if (features.remote) bom.push({ ...ADDONS.RAC, qty: 1 });
    if (features.eventApi) bom.push({ ...ADDONS.EVT_API, qty: 1 });
    if (features.gis) bom.push({ ...ADDONS.GIS, qty: 1 });
    if (features.serverMatching) {
      if (!bom.find(b => b.id === ADDONS.SVM.id)) {
        bom.push({ ...ADDONS.SVM, qty: 1 });
      }
    }
    if (features.rollCall) bom.push({ ...ADDONS.RCL, qty: 1 });
    if (features.plugin) bom.push({ ...ADDONS.PLG, qty: 1 });
    if (inputs.mcsServers > 0) {
      bom.push({ ...ADDONS.MCS_BAS, qty: 1 });
      if (inputs.mcsServers > 1) {
        bom.push({ ...ADDONS.MCS_ADD, qty: inputs.mcsServers - 1 });
      }
    }
    if (inputs.video > 0) bom.push({ ...ADDONS.VIDEO, qty: inputs.video });
    if (inputs.qr > 0) bom.push({ ...ADDONS.DEV_QR, qty: inputs.qr });
    if (inputs.wireless > 0) bom.push({ ...ADDONS.DEV_WL, qty: inputs.wireless });

    return bom;
  }

  let candidates = [...LICENSE_TIERS];
  if (isMigration) {
    if (isStarterNoMigration) {
      // BS2 Starter: allow Device Manager if client has 0 doors
    } else if (acMapping) {
      candidates = candidates.filter(t => t.id !== 'BIOSTARX-STR' && t.id !== 'BIOSTARX-DEV');
    }
  }
  const needsAdvancedPlus = needsAdvPkg || features.maps || features.visitor || 
    features.gis || features.serverMatching || features.rollCall || features.directory ||
    inputs.mcsServers > 0 || inputs.video > 0;
  if (needsAdvancedPlus) {
    candidates = candidates.filter(t => t.id !== 'BIOSTARX-STR' && t.id !== 'BIOSTARX-ESS' && t.id !== 'BIOSTARX-DEV');
  }

  let selected = candidates.find(t => {
    if (t.id === 'BIOSTARX-DEV') {
      return reqD === 0 && reqU <= t.maxUsers && reqO <= t.maxOperators;
    }
    return reqU <= t.maxUsers && reqO <= t.maxOperators && reqD <= t.maxDoors;
  }) || candidates[candidates.length - 1];

  if (isMigration && acMapping && acMapping.base && !isStarterNoMigration) {
    const mappedTier = candidates.find(t => t.id === acMapping.base);
    if (mappedTier) {
      const mappedIdx = tierIndex(mappedTier.id);
      const selectedIdx = tierIndex(selected.id);
      if (mappedIdx > selectedIdx) {
        selected = mappedTier;
      }
    }
  }

  let alternative: CalculatedBOM['alternative'] | undefined;

  const recommendedBom = getBomForTier(selected);
  const migrationCoversAll = isMigration && acMapping && !isStarterNoMigration &&
    recommendedBom.every(item => item.foc || item.qty === 0);

  if (!migrationCoversAll && selected.id !== 'BIOSTARX-STR' && selected.id !== 'BIOSTARX-DEV') {
    const currentIndex = candidates.findIndex(t => t.id === selected.id);
    let altTier: LicenseTier | undefined;
    for (let i = currentIndex - 1; i >= 0; i--) {
      const candidate = candidates[i];
      if (candidate.id === 'BIOSTARX-STR') continue;
      if (candidate.id === 'BIOSTARX-DEV') {
        if (isStarterNoMigration && reqD === 0) {
          altTier = candidate;
        }
        break;
      }
      altTier = candidate;
      break;
    }
    if (altTier) {
      alternative = {
        selected: altTier,
        bom: getBomForTier(altTier),
        reason: "Costo optimizado mediante paquetes de expansión"
      };
    }
  }

  const migrationNotes: MigrationNote[] = [];

  if (isStarterNoMigration) {
    migrationNotes.push({
      type: 'warning',
      messageKey: 'migration.starterNoMigration'
    });
  }

  if (isMigration && inputs.bs2VisitorLicense && features.visitor && acMapping && acMapping.base) {
    const baseTierIdx = tierIndex(acMapping.base);
    const advIdx = tierIndex('BIOSTARX-ADV');
    if (baseTierIdx < advIdx) {
      migrationNotes.push({
        type: 'warning',
        messageKey: 'migration.basicVisitorUpgradeWarning'
      });
    }
  }

  if (isMigration && inputs.bs2TaLicense === 'BioStar2-TA-Starter') {
    migrationNotes.push({
      type: 'warning',
      messageKey: 'migration.taStarterNoMigration'
    });
  }

  if (isMigration && inputs.bs2TaLicense && features.tna) {
    const taMapping = (MIGRATION_MAPPING.TA as any)[inputs.bs2TaLicense];
    if (taMapping && !taMapping.noMigration) {
      const tnaUsers = inputs.tnaUsers || effectiveUsers;
      if (taMapping.addon === 'TNA_STD' && tnaUsers > 500) {
        migrationNotes.push({
          type: 'warning',
          messageKey: 'migration.tnaStandardUpgradeWarning'
        });
      }
    }
  }

  if (isMigration && inputs.video > 0) {
    migrationNotes.push({
      type: 'info',
      messageKey: 'migration.videoNotEligible'
    });
  }

  if (isMigration && features.remote) {
    migrationNotes.push({
      type: 'info',
      messageKey: 'migration.remoteNotEligible'
    });
  }

  if (isMigration && acMapping && !isStarterNoMigration) {
    migrationNotes.push({
      type: 'info',
      messageKey: 'migration.bs2MustDisable'
    });
    migrationNotes.push({
      type: 'info',
      messageKey: 'migration.onlyEquivalentLicenses'
    });
  }

  return { 
    bom: recommendedBom, 
    selected,
    alternative,
    ...(migrationNotes.length > 0 ? { migrationNotes } : {})
  };
}

export interface CSVExportOptions {
  projectName?: string;
  client?: string;
  tierName: string;
  bom: BomItem[];
  alternative?: BomItem[];
  alternativeTierName?: string;
  language?: string;
}

const csvStrings: Record<string, Record<string, string>> = {
  es: {
    project: 'Proyecto',
    client: 'Cliente',
    mainTier: 'Tier Principal',
    date: 'Fecha',
    recommended: 'OPCIÓN RECOMENDADA',
    alternative: 'OPCIÓN ALTERNATIVA (OPTIMIZADA)',
    tier: 'Tier',
    altNote: 'Esta es una opción de costo optimizado basada en paquetes de expansión.',
    note: 'Nota',
    noName: 'Sin nombre',
    noClient: 'Sin especificar',
    partNumber: 'Part Number',
    description: 'Descripcion',
    quantity: 'Cantidad',
    noteHeader: 'Nota',
    foc: 'Free of Charge',
  },
  en: {
    project: 'Project',
    client: 'Client',
    mainTier: 'Main Tier',
    date: 'Date',
    recommended: 'RECOMMENDED OPTION',
    alternative: 'ALTERNATIVE OPTION (OPTIMIZED)',
    tier: 'Tier',
    altNote: 'This is a cost-optimized option based on expansion packages.',
    note: 'Note',
    noName: 'Unnamed',
    noClient: 'Not specified',
    partNumber: 'Part Number',
    description: 'Description',
    quantity: 'Quantity',
    noteHeader: 'Note',
    foc: 'Free of Charge',
  },
  pt: {
    project: 'Projeto',
    client: 'Cliente',
    mainTier: 'Tier Principal',
    date: 'Data',
    recommended: 'OPÇÃO RECOMENDADA',
    alternative: 'OPÇÃO ALTERNATIVA (OTIMIZADA)',
    tier: 'Tier',
    altNote: 'Esta é uma opção de custo otimizado baseada em pacotes de expansão.',
    note: 'Nota',
    noName: 'Sem nome',
    noClient: 'Não especificado',
    partNumber: 'Part Number',
    description: 'Descrição',
    quantity: 'Quantidade',
    noteHeader: 'Nota',
    foc: 'Free of Charge',
  },
};

export function generateCSVContent(options: CSVExportOptions): string {
  const { projectName, client, tierName, bom, alternative, alternativeTierName, language = 'es' } = options;
  const s = csvStrings[language] || csvStrings.es;
  const locale = language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES';
  const headers = [s.partNumber, s.description, s.quantity, s.noteHeader];
  
  const content = [
    `# ${s.mainTier}: BioStar X ${tierName}`,
    `# ${s.date}: ${new Date().toLocaleDateString(locale)}`,
    '',
    `### ${s.recommended} ###`,
    headers.join(','),
    ...bom.map(item => [item.id, item.name, item.qty.toString(), item.foc ? s.foc : ''].map(cell => `"${cell}"`).join(',')),
  ];

  if (alternative && alternativeTierName) {
    content.push(
      '',
      `### ${s.alternative} ###`,
      `# ${s.tier}: BioStar X ${alternativeTierName}`,
      `# ${s.note}: ${s.altNote}`,
      headers.join(','),
      ...alternative.map(item => [item.id, item.name, item.qty.toString(), item.foc ? s.foc : ''].map(cell => `"${cell}"`).join(','))
    );
  }

  return content.join('\n');
}

export function generateCSVFilename(projectName?: string): string {
  const date = new Date().toISOString().split('T')[0];
  const safeName = projectName?.trim()?.replace(/\s+/g, '_');
  return safeName 
    ? `BioStarX_BOM_${safeName}_${date}.csv`
    : `BioStarX_BOM_${date}.csv`;
}

export function downloadCSV(options: CSVExportOptions): void {
  const csvContent = generateCSVContent(options);
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = generateCSVFilename(options.projectName);
  link.click();
  URL.revokeObjectURL(url);
}

export function getTotalItems(bom: BomItem[]): number {
  return bom.reduce((acc, item) => acc + item.qty, 0);
}
