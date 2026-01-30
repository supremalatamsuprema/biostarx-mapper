import type { LicenseTier, Addon } from "@/types/license";

export const LICENSE_TIERS: LicenseTier[] = [
  { id: 'BIOSTARX-DVM', name: 'Device Manager', maxDoors: 0, maxUsers: 200, maxOperators: 1, desc: 'Gestión de dispositivos.' },
  { id: 'BIOSTARX-STR', name: 'Starter', maxDoors: 5, maxUsers: 100, maxOperators: 1, desc: 'Pequeños sitios.' },
  { id: 'BIOSTARX-ESS', name: 'Essential', maxDoors: 32, maxUsers: 1000, maxOperators: 10, desc: 'PyMEs con expansión.' },
  { id: 'BIOSTARX-ADV', name: 'Advanced', maxDoors: 128, maxUsers: 50000, maxOperators: 20, desc: 'Profesional & Mapas.' },
  { id: 'BIOSTARX-ENT', name: 'Enterprise', maxDoors: 500, maxUsers: 100000, maxOperators: 40, desc: 'Todo incluido.' },
  { id: 'BIOSTARX-ELT', name: 'Elite', maxDoors: 2000, maxUsers: 500000, maxOperators: 100, desc: 'Alta capacidad.' }
];

export const ADDONS: Record<string, Addon> = {
  VISITOR: { id: 'BIOSTARX-ADD-VIS', name: 'Visitor Management' },
  TNA_STD: { id: 'BIOSTARX-ADD-TNA-STD', name: 'T&A Standard' },
  TNA_ENT: { id: 'BIOSTARX-ADD-TNA-ENT', name: 'T&A Enterprise' },
  MOBILE: { id: 'BIOSTARX-ADD-MOB', name: 'Mobile App Support' },
  VIDEO: { id: 'BIOSTARX-ADD-VID', name: 'Video Channel' },
  API: { id: 'BIOSTARX-ADD-API', name: 'API Tech Support' },
  DIR: { id: 'BIOSTARX-ADD-DIR', name: 'Directory (AD/LDAP)' },
  RAC: { id: 'BIOSTARX-ADD-RAC', name: 'Remote Access (Annual)' },
  ADV_AC: { id: 'BIOSTARX-PKG-AAC', name: 'Advanced AC Package' },
  DOOR_UP: { id: 'BIOSTARX-UP-DOR', name: 'Upgr: +32 Doors' },
  OP_UP: { id: 'BIOSTARX-UP-OPR', name: 'Upgr: +5 Ops' },
  USR_UP: { id: 'BIOSTARX-UP-USR', name: 'Upgr: 5k Users (Ess)' },
  DEV_QR: { id: 'QR-LICENSE', name: 'Camera QR license' },
  DEV_WL: { id: 'WL-LICENSE', name: 'Wireless Lock' },
  EVT_API: { id: 'BIOSTARX-ADD-EVT', name: 'Event API License' }
};

export const CLIENT_TYPES = ["Integrador", "Dealer", "Distribuidor", "Cliente Final"];

export const MIGRATION_MAPPING = {
  AC: {
    'BioStar2-Basic': { base: 'BIOSTARX-ESS', addons: [] },
    'BioStar2-Standard': { base: 'BIOSTARX-ESS', addons: ['DOOR_UP', 'ADV_AC'] },
    'BioStar2-Advanced': { base: 'BIOSTARX-ADV', addons: ['ADV_AC'] },
    'BioStar2-Professional': { base: 'BIOSTARX-ENT', addons: ['ADV_AC'] },
    'BioStar2-Enterprise': { base: 'BIOSTARX-ELT', addons: ['ADV_AC'] },
  },
  TA: {
    'BioStar2-TA-Standard': ['TNA_STD'],
    'BioStar2-TA-Advanced': ['TNA_ENT'],
    'BioStar2-TA-Professional': ['TNA_ENT'],
  },
  VISITOR: {
    'BioStar2-Visitor': ['VISITOR'],
  }
};

export const DISCLAIMER = `Esta herramienta es una guía de ayuda para preventa. Los resultados son estimaciones y requieren validación oficial de Suprema. El software se entrega "tal cual". Contacto: latam@supremainc.com`;

export const ADVANCED_AC_FEATURES = [
  { id: 'globalApb', label: 'Global APB' },
  { id: 'fire', label: 'Fire Zones' },
  { id: 'elevator', label: 'Elevator' },
  { id: 'interlock', label: 'Interlock' },
  { id: 'intrusion', label: 'Intrusion' },
  { id: 'mustering', label: 'Mustering' },
  { id: 'occupancy', label: 'Occupancy' }
] as const;
