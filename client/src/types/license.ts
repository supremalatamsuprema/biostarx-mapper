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
  foc?: boolean;
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
  bs2TaLicense: string;
  bs2VisitorLicense: boolean;
  dashboardFile: string;
  dashboardFileData: string;
  versionFile: string;
  versionFileData: string;
  licenseFile: string;
  licenseFileData: string;
  hardwareChecked: boolean;
  bs2UsesCloud: boolean;
  bs2UsesApp: boolean;
  bs2AppSameNetwork: boolean;
  bs2AppOutsideNetwork: boolean;
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
  mcsServers: number;
  activationCode?: string;
  bs2TaLicense?: string;
  bs2VisitorLicense?: boolean;
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
  directory: boolean;
  remote: boolean;
  eventApi: boolean;
  gis: boolean;
  serverMatching: boolean;
  rollCall: boolean;
  plugin: boolean;
}

export interface MigrationNote {
  type: 'warning' | 'info';
  messageKey: string;
}

export interface CalculatedBOM {
  bom: BomItem[];
  selected: LicenseTier;
  alternative?: {
    bom: BomItem[];
    selected: LicenseTier;
    reason: string;
  };
  migrationNotes?: MigrationNote[];
}
