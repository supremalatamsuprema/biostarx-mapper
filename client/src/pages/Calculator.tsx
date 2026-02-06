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
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { EmailDialog } from "@/components/EmailDialog";
import { calculateBOM } from "@/lib/calc";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { MIGRATION_MAPPING } from "@/data/licenseData";
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
  const { t } = useI18n();
  const [showReport, setShowReport] = useState(false);
  const [showExportDisclaimer, setShowExportDisclaimer] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
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
    bs2TaLicense: '',
    bs2VisitorLicense: false,
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
    operators: 0,
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
    return calculateBOM(inputs, features);
  }, [inputs, features]);

  useEffect(() => {
    if (prevTierRef.current && prevTierRef.current !== calculatedBOM.selected.id) {
      setTierChanged(true);
      const timer = setTimeout(() => setTierChanged(false), 600);
      return () => clearTimeout(timer);
    }
    prevTierRef.current = calculatedBOM.selected.id;
  }, [calculatedBOM.selected.id]);

  useEffect(() => {
    if (inputs.scenario === 'migration') {
      if (meta.activationCode && inputs.activationCode !== meta.activationCode) {
        setInputs(prev => ({ ...prev, activationCode: meta.activationCode }));
      }

      const newFeatures = { ...features };

      if (meta.activationCode) {
        const mapping = (MIGRATION_MAPPING.AC as any)[meta.activationCode];
        const hasZones = mapping && mapping.addons.includes('ADV_AC');
        newFeatures.globalApb = hasZones;
        newFeatures.fire = hasZones;
        newFeatures.elevator = hasZones;
        newFeatures.interlock = hasZones;
        newFeatures.intrusion = hasZones;
        newFeatures.mustering = hasZones;
        newFeatures.occupancy = hasZones;
      } else {
        newFeatures.globalApb = false;
        newFeatures.fire = false;
        newFeatures.elevator = false;
        newFeatures.interlock = false;
        newFeatures.intrusion = false;
        newFeatures.mustering = false;
        newFeatures.occupancy = false;
      }

      newFeatures.tna = !!meta.bs2TaLicense;
      newFeatures.visitor = !!meta.bs2VisitorLicense;

      setFeatures(newFeatures);
    }
  }, [meta.activationCode, meta.bs2TaLicense, meta.bs2VisitorLicense, inputs.scenario]);

  const handleGenerateReport = () => {
    if (!meta.projectName.trim()) {
      toast({
        title: t("validation.required"),
        description: t("validation.projectName"),
        variant: "destructive"
      });
      return;
    }
    if (!meta.client.trim()) {
      toast({
        title: t("validation.required"), 
        description: t("validation.client"),
        variant: "destructive"
      });
      return;
    }
    if (inputs.users === 0 && inputs.doors === 0 && inputs.devices === 0 && inputs.operators === 0) {
      toast({
        title: t("validation.required"),
        description: t("validation.capacity"),
        variant: "destructive"
      });
      return;
    }
    setShowExportDisclaimer(true);
  };

  const handleConfirmExport = () => {
    setShowExportDisclaimer(false);
    setShowReport(true);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    onReset();
  };

  return (
    <div className="min-h-screen p-4 lg:p-10 max-w-[1680px] mx-auto animate-fadeIn pb-24 xl:pb-10">
      <Header 
        scenario={inputs.scenario} 
        onReset={handleReset} 
        calculatedBOM={calculatedBOM}
        meta={meta}
        onGenerateReport={handleGenerateReport}
      />

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
            onSendEmail={() => setShowEmailDialog(true)}
          />
        </div>
      </div>

      <MobileBomSheet 
        calculatedBOM={calculatedBOM}
        onGenerateReport={handleGenerateReport}
      />

      <DisclaimerModal
        open={showExportDisclaimer}
        onAccept={handleConfirmExport}
      />

      <ReportModal
        open={showReport}
        onClose={() => setShowReport(false)}
        meta={meta}
        inputs={inputs}
        features={features}
        calculatedBOM={calculatedBOM}
        onSendEmail={() => {
          setShowReport(false);
          setShowEmailDialog(true);
        }}
      />

      <EmailDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        calculatedBOM={calculatedBOM}
        meta={meta}
        inputs={inputs}
      />
    </div>
  );
}
