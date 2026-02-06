import { LICENSE_TIERS, ADDONS, MIGRATION_MAPPING } from "@/data/licenseData";
import type { 
  ProjectInputs, 
  FeatureFlags, 
  CalculatedBOM, 
  BomItem,
  LicenseTier
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

export function calculateBOM(inputs: ProjectInputs, features: FeatureFlags): CalculatedBOM {
  const reqD = inputs.doors;
  const reqO = inputs.operators;
  const needsAdvPkg = needsAdvancedPackage(features);

  const effectiveUsers = features.tna 
    ? Math.max(inputs.users, inputs.tnaUsers || 0)
    : inputs.users;

  const reqU = effectiveUsers;

  const isBS2Starter = inputs.scenario === 'migration' && inputs.activationCode === 'BioStar2-Starter';

  function getBomForTier(selectedTier: LicenseTier): BomItem[] {
    const bom: BomItem[] = [];

    const tierIsFoc = isBS2Starter && selectedTier.id === 'BIOSTARX-DVM';
    bom.push({ id: selectedTier.id, name: `BioStar X ${selectedTier.name}`, qty: 1, foc: tierIsFoc || undefined });

    if (selectedTier.id === 'BIOSTARX-ESS' && reqU > 1000) {
      const uGap = reqU - 1000;
      bom.push({ ...ADDONS.USR_UP, qty: Math.ceil(uGap / 5000) });
    }

    if (selectedTier.id === 'BIOSTARX-ADV' && reqU > 50000) {
      const uGap = reqU - 50000;
      bom.push({ ...ADDONS.USR_UP, qty: Math.ceil(uGap / 50000) });
    }

    const effectiveDoors = inputs.scenario === 'migration' && inputs.activationCode
      ? Math.max(reqD, BS2_DOOR_LIMITS[inputs.activationCode] || 0)
      : reqD;

    const dGap = Math.max(0, effectiveDoors - selectedTier.maxDoors);
    if (dGap > 0) {
      bom.push({ ...ADDONS.DOOR_UP, qty: Math.ceil(dGap / 32) });
    }

    const oGap = Math.max(0, reqO - selectedTier.maxOperators);
    if (oGap > 0) {
      bom.push({ ...ADDONS.OP_UP, qty: Math.ceil(oGap / 5) });
    }

    if (needsAdvPkg && selectedTier.id !== 'BIOSTARX-ENT' && selectedTier.id !== 'BIOSTARX-ELT') {
      if (!bom.find(b => b.id === ADDONS.ADV_AC.id)) {
        bom.push({ ...ADDONS.ADV_AC, qty: 1 });
      }
    }

    if (inputs.scenario === 'migration' && inputs.activationCode) {
      const mapping = (MIGRATION_MAPPING.AC as any)[inputs.activationCode];
      if (mapping && mapping.addons) {
        mapping.addons.forEach((addonKey: string) => {
          if (addonKey === 'DOOR_UP') return;
          const addon = (ADDONS as any)[addonKey];
          if (addon && !bom.find(b => b.id === addon.id)) {
            bom.push({ ...addon, qty: 1 });
          }
        });
      }
    }

    if (features.visitor) {
      if (!bom.find(b => b.id === ADDONS.VISITOR.id)) {
        const visitorFoc = isBS2Starter ? true : undefined;
        bom.push({ ...ADDONS.VISITOR, qty: 1, foc: visitorFoc });
      }
    }
    if (features.tna) {
      const tnaUsers = inputs.tnaUsers || reqU;
      const tnaAddon = tnaUsers > 500 ? ADDONS.TNA_ENT : ADDONS.TNA_STD;
      if (!bom.find(b => b.id === tnaAddon.id)) {
        bom.push({ ...tnaAddon, qty: 1 });
      }
    }
    if (features.mobile) bom.push({ ...ADDONS.MOBILE, qty: 1 });
    if (features.api) bom.push({ ...ADDONS.API, qty: 1 });
    if (features.directory) bom.push({ ...ADDONS.DIR, qty: 1 });
    if (features.remote) bom.push({ ...ADDONS.RAC, qty: 1 });
    if (features.eventApi) bom.push({ ...ADDONS.EVT_API, qty: 1 });
    if (inputs.video > 0) bom.push({ ...ADDONS.VIDEO, qty: inputs.video });
    if (inputs.qr > 0) bom.push({ ...ADDONS.DEV_QR, qty: inputs.qr });
    if (inputs.wireless > 0) bom.push({ ...ADDONS.DEV_WL, qty: inputs.wireless });

    return bom;
  }

  let candidates = [...LICENSE_TIERS];
  if (inputs.scenario === 'migration') {
    if (isBS2Starter) {
      candidates = candidates.filter(t => t.id !== 'BIOSTARX-DVM' || (reqD === 0));
    } else {
      candidates = candidates.filter(t => t.id !== 'BIOSTARX-STR' && t.id !== 'BIOSTARX-DVM');
    }
  }
  if (needsAdvPkg || features.maps) {
    candidates = candidates.filter(t => t.id !== 'BIOSTARX-STR' && t.id !== 'BIOSTARX-ESS' && t.id !== 'BIOSTARX-DVM');
  }

  if (features.visitor) {
    candidates = candidates.filter(t => t.id !== 'BIOSTARX-STR' && t.id !== 'BIOSTARX-ESS' && t.id !== 'BIOSTARX-DVM');
  }

  let selected = candidates.find(t => {
    if (t.id === 'BIOSTARX-DVM') {
      return reqD === 0 && reqU <= t.maxUsers && reqO <= t.maxOperators;
    }
    return reqU <= t.maxUsers && reqO <= t.maxOperators && reqD <= t.maxDoors;
  }) || candidates[candidates.length - 1];

  if (inputs.scenario === 'migration' && inputs.activationCode && (MIGRATION_MAPPING.AC as any)[inputs.activationCode]) {
    if (!(isBS2Starter && selected.id === 'BIOSTARX-DVM')) {
      const mapping = (MIGRATION_MAPPING.AC as any)[inputs.activationCode];
      const mappedTier = candidates.find(t => t.id === mapping.base);
      if (mappedTier) {
        const mappedIndex = candidates.findIndex(t => t.id === mappedTier.id);
        const selectedIndex = candidates.findIndex(t => t.id === selected.id);
        if (mappedIndex > selectedIndex) {
          selected = mappedTier;
        }
      }
    }
  }

  let alternative: CalculatedBOM['alternative'] | undefined;
  
  if (selected.id !== 'BIOSTARX-STR' && selected.id !== 'BIOSTARX-DVM') {
    const currentIndex = candidates.findIndex(t => t.id === selected.id);
    if (currentIndex > 0) {
      const lowerTier = candidates[currentIndex - 1];
      const isUpgradable = lowerTier.id !== 'BIOSTARX-STR' && lowerTier.id !== 'BIOSTARX-DVM';
      if (isUpgradable) {
        alternative = {
          selected: lowerTier,
          bom: getBomForTier(lowerTier),
          reason: "Costo optimizado mediante paquetes de expansión"
        };
      }
    }
  }

  return { 
    bom: getBomForTier(selected), 
    selected,
    alternative
  };
}

export interface CSVExportOptions {
  projectName?: string;
  client?: string;
  tierName: string;
  bom: BomItem[];
  alternative?: BomItem[];
  alternativeTierName?: string;
}

export function generateCSVContent(options: CSVExportOptions): string {
  const { projectName, client, tierName, bom, alternative, alternativeTierName } = options;
  const headers = ['Part Number', 'Descripcion', 'Cantidad', 'Nota'];
  
  const content = [
    `# Proyecto: ${projectName?.trim() || 'Sin nombre'}`,
    `# Cliente: ${client?.trim() || 'Sin especificar'}`,
    `# Tier Principal: BioStar X ${tierName}`,
    `# Fecha: ${new Date().toLocaleDateString('es-ES')}`,
    '',
    '### OPCIÓN RECOMENDADA ###',
    headers.join(','),
    ...bom.map(item => [item.id, item.name, item.qty.toString(), item.foc ? 'Free of Charge' : ''].map(cell => `"${cell}"`).join(',')),
  ];

  if (alternative && alternativeTierName) {
    content.push(
      '',
      '### OPCIÓN ALTERNATIVA (OPTIMIZADA) ###',
      `# Tier: BioStar X ${alternativeTierName}`,
      `# Nota: Esta es una opción de costo optimizado basada en paquetes de expansión.`,
      headers.join(','),
      ...alternative.map(item => [item.id, item.name, item.qty.toString(), item.foc ? 'Free of Charge' : ''].map(cell => `"${cell}"`).join(','))
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
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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
