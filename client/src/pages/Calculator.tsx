import { useState, useMemo, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { ProjectMetadataForm } from "@/components/ProjectMetadataForm";
import { MigrationValidation } from "@/components/MigrationValidation";
import { CapacityInputs } from "@/components/CapacityInputs";
import { FeaturesSection } from "@/components/FeaturesSection";
import { DeviceLicenses } from "@/components/DeviceLicenses";
import { BomSidebar } from "@/components/BomSidebar";
import { MobileBomSheet } from "@/components/MobileBomSheet";
import { ReportModal } from "@/components/ReportModal";
import { LICENSE_TIERS, ADDONS } from "@/data/licenseData";
import { useToast } from "@/hooks/use-toast";
import type { ProjectMeta, ProjectInputs, FeatureFlags, CalculatedBOM } from "@/types/license";

interface CalculatorProps {
  scenario: ProjectInputs['scenario'];
  onReset: () => void;
}

const STORAGE_KEY = 'biostarx-draft';

function loadDraft(scenario: ProjectInputs['scenario']) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.inputs?.scenario === scenario) {
        return data;
      }
    }
  } catch (e) {
    console.error('Error loading draft:', e);
  }
  return null;
}

export function Calculator({ scenario, onReset }: CalculatorProps) {
  const { toast } = useToast();
  const [showReport, setShowReport] = useState(false);
  const [tierChanged, setTierChanged] = useState(false);
  const prevTierRef = useRef<string>('');
  
  const draft = loadDraft(scenario);
  
  const [meta, setMeta] = useState<ProjectMeta>(draft?.meta || {
    projectName: '',
    client: '',
    clientType: 'Integrador',
    country: '',
    contactFirst: '',
    contactLast: '',
    phone: '',
    email: '',
    authorized: false,
    bs2Version: '',
    activationCode: '',
    dashboardFile: '',
    versionFile: '',
    licenseFile: '',
    hardwareChecked: false
  });

  const [inputs, setInputs] = useState<ProjectInputs>(draft?.inputs || {
    scenario,
    users: 0,
    doors: 0,
    devices: 0,
    operators: 1,
    video: 0,
    qr: 0,
    wireless: 0,
    tnaUsers: 0
  });

  const [features, setFeatures] = useState<FeatureFlags>(draft?.features || {
    globalApb: false,
    fire: false,
    elevator: false,
    interlock: false,
    intrusion: false,
    mustering: false,
    occupancy: false,
    maps: false,
    tna: false,
    visitor: false,
    mobile: false,
    api: false,
    directory: false,
    remote: false,
    eventApi: false
  });

  useEffect(() => {
    const data = { meta, inputs, features };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [meta, inputs, features]);

  const calculatedBOM = useMemo<CalculatedBOM>(() => {
    const bom: CalculatedBOM['bom'] = [];
    const reqD = inputs.doors;
    const reqU = inputs.users;
    const reqO = inputs.operators;

    const needsAdvPkg = features.globalApb || features.fire || features.elevator || 
                        features.interlock || features.intrusion || features.mustering || 
                        features.occupancy;

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
  }, [inputs, features]);

  useEffect(() => {
    if (prevTierRef.current && prevTierRef.current !== calculatedBOM.selected.id) {
      setTierChanged(true);
      const timer = setTimeout(() => setTierChanged(false), 600);
      return () => clearTimeout(timer);
    }
    prevTierRef.current = calculatedBOM.selected.id;
  }, [calculatedBOM.selected.id]);

  const handleGenerateReport = () => {
    if (!meta.projectName.trim()) {
      toast({
        title: "Campo requerido",
        description: "Por favor ingresa el nombre del proyecto",
        variant: "destructive"
      });
      return;
    }
    if (!meta.client.trim()) {
      toast({
        title: "Campo requerido", 
        description: "Por favor ingresa el nombre del cliente",
        variant: "destructive"
      });
      return;
    }
    setShowReport(true);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    onReset();
  };

  return (
    <div className="min-h-screen p-4 lg:p-10 max-w-[1680px] mx-auto animate-fadeIn pb-24 xl:pb-10">
      <Header scenario={inputs.scenario} onReset={handleReset} />

      <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 items-start">
        <div className="w-full xl:w-[68%] space-y-6 sm:space-y-8">
          <ProjectMetadataForm meta={meta} onChange={setMeta} />
          
          {inputs.scenario === 'migration' && (
            <MigrationValidation meta={meta} onChange={setMeta} />
          )}
          
          <CapacityInputs inputs={inputs} onChange={setInputs} />
          
          <FeaturesSection 
            inputs={inputs}
            features={features}
            onInputsChange={setInputs}
            onFeaturesChange={setFeatures}
          />
          
          <DeviceLicenses inputs={inputs} onChange={setInputs} />
        </div>

        <div className="hidden xl:block w-[32%] self-start">
          <BomSidebar 
            calculatedBOM={calculatedBOM}
            onGenerateReport={handleGenerateReport}
            tierChanged={tierChanged}
            meta={meta}
          />
        </div>
      </div>

      <MobileBomSheet 
        calculatedBOM={calculatedBOM}
        onGenerateReport={handleGenerateReport}
      />

      <ReportModal
        open={showReport}
        onClose={() => setShowReport(false)}
        meta={meta}
        inputs={inputs}
        features={features}
        calculatedBOM={calculatedBOM}
      />
    </div>
  );
}
