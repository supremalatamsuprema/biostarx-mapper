import type { ProjectInputs, FeatureFlags, ProjectMeta } from "@/types/license";

interface ShareableState {
  s: string;
  pn?: string;
  cl?: string;
  ct?: string;
  co?: string;
  u?: number;
  d?: number;
  dv?: number;
  op?: number;
  v?: number;
  qr?: number;
  wl?: number;
  ta?: number;
  mc?: number;
  vl?: number;
  f?: number;
}

const FEATURE_KEYS: (keyof FeatureFlags)[] = [
  'globalApb', 'fire', 'elevator', 'interlock', 'intrusion',
  'mustering', 'occupancy', 'maps', 'tna', 'visitor',
  'mobile', 'directory', 'remote', 'eventApi',
  'gis', 'serverMatching', 'rollCall', 'plugin'
];

function featuresToBitmask(features: FeatureFlags): number {
  let mask = 0;
  FEATURE_KEYS.forEach((key, i) => {
    if (features[key]) mask |= (1 << i);
  });
  return mask;
}

function bitmaskToFeatures(mask: number): FeatureFlags {
  const features: any = {};
  FEATURE_KEYS.forEach((key, i) => {
    features[key] = !!(mask & (1 << i));
  });
  return features as FeatureFlags;
}

export function encodeShareState(
  meta: ProjectMeta,
  inputs: ProjectInputs,
  features: FeatureFlags
): string {
  const state: ShareableState = {
    s: inputs.scenario || 'new',
  };

  if (meta.projectName) state.pn = meta.projectName;
  if (meta.client) state.cl = meta.client;
  if (meta.clientType && meta.clientType !== 'Integrador') state.ct = meta.clientType;
  if (meta.country) state.co = meta.country;

  if (inputs.users > 0) state.u = inputs.users;
  if (inputs.doors > 0) state.d = inputs.doors;
  if (inputs.devices > 0) state.dv = inputs.devices;
  if (inputs.operators > 0) state.op = inputs.operators;
  if (inputs.video > 0) state.v = inputs.video;
  if (inputs.qr > 0) state.qr = inputs.qr;
  if (inputs.wireless > 0) state.wl = inputs.wireless;
  if (inputs.tnaUsers > 0) state.ta = inputs.tnaUsers;
  if (inputs.mcsServers > 0) state.mc = inputs.mcsServers;

  if (meta.bs2VisitorLicense) state.vl = 1;

  const fMask = featuresToBitmask(features);
  if (fMask > 0) state.f = fMask;

  const json = JSON.stringify(state);
  return btoa(encodeURIComponent(json));
}

export function decodeShareState(hash: string): {
  meta: Partial<ProjectMeta>;
  inputs: Partial<ProjectInputs>;
  features: FeatureFlags;
} | null {
  try {
    const json = decodeURIComponent(atob(hash));
    const state: ShareableState = JSON.parse(json);

    const meta: Partial<ProjectMeta> = {
      projectName: state.pn || '',
      client: state.cl || '',
      clientType: state.ct || 'Integrador',
      country: state.co || '',
      bs2VisitorLicense: !!state.vl,
    };

    const inputs: Partial<ProjectInputs> = {
      scenario: (state.s as ProjectInputs['scenario']) || 'new',
      users: state.u || 0,
      doors: state.d || 0,
      devices: state.dv || 0,
      operators: state.op || 0,
      video: state.v || 0,
      qr: state.qr || 0,
      wireless: state.wl || 0,
      tnaUsers: state.ta || 0,
      mcsServers: state.mc || 0,
    };

    const features = bitmaskToFeatures(state.f || 0);

    return { meta, inputs, features };
  } catch (e) {
    console.error('Error decoding share state:', e);
    return null;
  }
}

export function generateShareURL(
  meta: ProjectMeta,
  inputs: ProjectInputs,
  features: FeatureFlags
): string {
  const encoded = encodeShareState(meta, inputs, features);
  const url = new URL(window.location.href);
  url.hash = '';
  url.search = `?share=${encoded}`;
  return url.toString();
}

export function getShareFromURL(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('share');
}
