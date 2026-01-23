export interface LicenseTier {
  id: string;
  name: string;
  maxDoors: number;
  maxUsers: number;
  maxOperators: number;
  desc: string;
}

export interface Addon {
  id: string;
  name: string;
}

export interface BomItem {
  id: string;
  name: string;
  qty: number;
}

export interface ProjectMeta {
  projectName: string;
  client: string;
  clientType: string;
  country: string;
  contactFirst: string;
  contactLast: string;
  phone: string;
  email: string;
  authorized: boolean;
  bs2Version: string;
  activationCode: string;
  dashboardFile: string;
  versionFile: string;
  licenseFile: string;
  hardwareChecked: boolean;
}

export interface ProjectInputs {
  scenario: 'new' | 'migration' | '';
  users: number;
  doors: number;
  devices: number;
  operators: number;
  video: number;
  qr: number;
  wireless: number;
  tnaUsers: number;
  activationCode?: string; // BioStar 2 license tier for migration
}

export interface FeatureFlags {
  globalApb: boolean;
  fire: boolean;
  elevator: boolean;
  interlock: boolean;
  intrusion: boolean;
  mustering: boolean;
  occupancy: boolean;
  maps: boolean;
  tna: boolean;
  visitor: boolean;
  mobile: boolean;
  api: boolean;
  directory: boolean;
  remote: boolean;
  eventApi: boolean;
}

export interface CalculatedBOM {
  bom: BomItem[];
  selected: LicenseTier;
  alternative?: {
    bom: BomItem[];
    selected: LicenseTier;
    reason: string;
  };
}
