import { LICENSE_TIERS, ADDONS } from "@/data/licenseData";
import type { 
  ProjectInputs, 
  FeatureFlags, 
  CalculatedBOM, 
  BomItem 
} from "@/types/license";

export function needsAdvancedPackage(features: FeatureFlags): boolean {
  return features.globalApb || features.fire || features.elevator || 
         features.interlock || features.intrusion || features.mustering || 
         features.occupancy;
}

export function calculateBOM(inputs: ProjectInputs, features: FeatureFlags): CalculatedBOM {
  const bom: BomItem[] = [];
  const reqD = inputs.doors;
  const reqU = inputs.users;
  const reqO = inputs.operators;

  const needsAdvPkg = needsAdvancedPackage(features);

  let candidates = [...LICENSE_TIERS];

  if (inputs.scenario === 'migration') {
    candidates = candidates.filter(t => t.id !== 'BIOSTARX-STR');
  }

  if (needsAdvPkg || features.maps) {
    candidates = candidates.filter(t => t.id !== 'BIOSTARX-STR' && t.id !== 'BIOSTARX-ESS');
  }

  let selected = candidates.find(t => reqU <= t.maxUsers && reqO <= t.maxOperators) || 
                 candidates[candidates.length - 1];

  if (reqD > selected.maxDoors) {
    const tierByDoors = candidates.find(t => reqD <= t.maxDoors) || 
                        candidates[candidates.length - 1];
    const currentIndex = candidates.findIndex(t => t.id === selected.id);
    const doorIndex = candidates.findIndex(t => t.id === tierByDoors.id);
    if (doorIndex > currentIndex) {
      selected = tierByDoors;
    }
  }

  bom.push({ id: selected.id, name: `BioStar X ${selected.name}`, qty: 1 });

  if (selected.id === 'BIOSTARX-ESS' && reqU > 1000) {
    const uGap = reqU - 1000;
    bom.push({ ...ADDONS.USR_UP, qty: Math.ceil(uGap / 5000) });
  }

  const dGap = Math.max(0, reqD - selected.maxDoors);
  if (dGap > 0) {
    bom.push({ ...ADDONS.DOOR_UP, qty: Math.ceil(dGap / 32) });
  }

  const oGap = Math.max(0, reqO - selected.maxOperators);
  if (oGap > 0) {
    bom.push({ ...ADDONS.OP_UP, qty: Math.ceil(oGap / 5) });
  }

  if (needsAdvPkg && selected.id !== 'BIOSTARX-ENT' && selected.id !== 'BIOSTARX-ELT') {
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

  return { bom, selected };
}

export interface CSVExportOptions {
  projectName?: string;
  client?: string;
  tierName: string;
  bom: BomItem[];
}

export function generateCSVContent(options: CSVExportOptions): string {
  const { projectName, client, tierName, bom } = options;
  const headers = ['Part Number', 'Descripcion', 'Cantidad'];
  const rows = bom.map(item => [item.id, item.name, item.qty.toString()]);
  
  return [
    `# Proyecto: ${projectName?.trim() || 'Sin nombre'}`,
    `# Cliente: ${client?.trim() || 'Sin especificar'}`,
    `# Tier: BioStar X ${tierName}`,
    `# Fecha: ${new Date().toLocaleDateString('es-ES')}`,
    '',
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
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
