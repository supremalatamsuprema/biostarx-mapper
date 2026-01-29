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

export function calculateBOM(inputs: ProjectInputs, features: FeatureFlags): CalculatedBOM {
  const reqD = inputs.doors;
  const reqO = inputs.operators;
  const needsAdvPkg = needsAdvancedPackage(features);

  // Requirement: If T&A is active, the effective user count must be the MAX of total users and T&A users
  const effectiveUsers = features.tna 
    ? Math.max(inputs.users, inputs.tnaUsers || 0)
    : inputs.users;

  const reqU = effectiveUsers;

  function getBomForTier(selectedTier: LicenseTier): BomItem[] {
    const bom: BomItem[] = [];
    bom.push({ id: selectedTier.id, name: `BioStar X ${selectedTier.name}`, qty: 1 });

    if (selectedTier.id === 'BIOSTARX-ESS' && reqU > 1000) {
      const uGap = reqU - 1000;
      bom.push({ ...ADDONS.USR_UP, qty: Math.ceil(uGap / 5000) });
    }

    // Advanced tier user expansion logic
    if (selectedTier.id === 'BIOSTARX-ADV' && reqU > 50000) {
      const uGap = reqU - 50000;
      bom.push({ ...ADDONS.USR_UP, qty: Math.ceil(uGap / 50000) });
    }

    const dGap = Math.max(0, reqD - selectedTier.maxDoors);
    if (dGap > 0) {
      bom.push({ ...ADDONS.DOOR_UP, qty: Math.ceil(dGap / 32) });
    }

    // Migration specific addons
    if (inputs.scenario === 'migration' && inputs.activationCode) {
      const mapping = (MIGRATION_MAPPING.AC as any)[inputs.activationCode];
      if (mapping && mapping.addons) {
        mapping.addons.forEach((addonKey: string) => {
          const addon = (ADDONS as any)[addonKey];
          if (addon && !bom.find(b => b.id === addon.id)) {
            bom.push({ ...addon, qty: 1 });
          }
        });
      }
    }

    const oGap = Math.max(0, reqO - selectedTier.maxOperators);
    if (oGap > 0) {
      bom.push({ ...ADDONS.OP_UP, qty: Math.ceil(oGap / 5) });
    }

    if (needsAdvPkg && selectedTier.id !== 'BIOSTARX-ENT' && selectedTier.id !== 'BIOSTARX-ELT') {
      bom.push({ ...ADDONS.ADV_AC, qty: 1 });
    }

    if (features.visitor) bom.push({ ...ADDONS.VISITOR, qty: 1 });
    if (features.tna) {
      const tnaUsers = inputs.tnaUsers || reqU;
      bom.push({ ...(tnaUsers > 500 ? ADDONS.TNA_ENT : ADDONS.TNA_STD), qty: 1 });
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
    candidates = candidates.filter(t => t.id !== 'BIOSTARX-STR');
  }
  if (needsAdvPkg || features.maps) {
    candidates = candidates.filter(t => t.id !== 'BIOSTARX-STR' && t.id !== 'BIOSTARX-ESS');
  }

  // Option 1: Natural tier for capacity
  let selected = candidates.find(t => reqU <= (t as any).maxUsers && reqO <= (t as any).maxOperators && reqD <= (t as any).maxDoors) || 
                 candidates[candidates.length - 1];

  // If migration scenario, force the equivalent base license if it exists
  if (inputs.scenario === 'migration' && inputs.activationCode && (MIGRATION_MAPPING.AC as any)[inputs.activationCode]) {
    const mapping = (MIGRATION_MAPPING.AC as any)[inputs.activationCode];
    const mappedTier = candidates.find(t => t.id === mapping.base);
    if (mappedTier) {
      selected = mappedTier;
    }
  }

  // Option 2: Cheaper tier with upgrades (if applicable)
  let alternative: CalculatedBOM['alternative'] | undefined;
  
  if (selected.id !== 'BIOSTARX-STR') {
    const currentIndex = candidates.findIndex(t => t.id === selected.id);
    if (currentIndex > 0) {
      const lowerTier = candidates[currentIndex - 1];
      // Check if lower tier is actually lower than what we would get with just doors
      const isUpgradable = lowerTier.id !== 'BIOSTARX-STR';
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
  const headers = ['Part Number', 'Descripcion', 'Cantidad'];
  
  const content = [
    `# Proyecto: ${projectName?.trim() || 'Sin nombre'}`,
    `# Cliente: ${client?.trim() || 'Sin especificar'}`,
    `# Tier Principal: BioStar X ${tierName}`,
    `# Fecha: ${new Date().toLocaleDateString('es-ES')}`,
    '',
    '### OPCIÓN RECOMENDADA ###',
    headers.join(','),
    ...bom.map(item => [item.id, item.name, item.qty.toString()].map(cell => `"${cell}"`).join(',')),
  ];

  if (alternative && alternativeTierName) {
    content.push(
      '',
      '### OPCIÓN ALTERNATIVA (OPTIMIZADA) ###',
      `# Tier: BioStar X ${alternativeTierName}`,
      `# Nota: Esta es una opción de costo optimizado basada en paquetes de expansión.`,
      headers.join(','),
      ...alternative.map(item => [item.id, item.name, item.qty.toString()].map(cell => `"${cell}"`).join(','))
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
