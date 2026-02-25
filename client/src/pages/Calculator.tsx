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
    dashboardFileData: '',
    versionFile: '',
    versionFileData: '',
    licenseFile: '',
    licenseFileData: '',
    hardwareChecked: false,
    bs2UsesCloud: false,
    bs2UsesApp: false,
    bs2AppSameNetwork: false,
    bs2AppOutsideNetwork: false
  });

  const [inputs, setInputs] = useState<ProjectInputs>({
    scenario,
    users: 0,
    doors: 0,
    devices: 0,
    operators: 0,
    video: 0,
    qr: 0,
    wireless: 0,
    tnaUsers: 0,
    mcsServers: 0,
    ...(draft?.inputs || {})
  });

  const [features, setFeatures] = useState<FeatureFlags>({
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
    directory: false,
    remote: false,
    eventApi: false,
    gis: false,
    serverMatching: false,
    rollCall: false,
    plugin: false,
    ...(draft?.features || {})
  });

  useEffect(() => {
    const { dashboardFileData, versionFileData, licenseFileData, ...metaWithoutFiles } = meta;
    const data = { meta: metaWithoutFiles, inputs, features };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [meta, inputs, features]);

  const doorsExceeded = inputs.doors > 2000;
  const hasCapacityData = !doorsExceeded && (inputs.users > 0 || inputs.doors > 0 || inputs.devices > 0 || inputs.operators > 0);

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
      if (meta.bs2TaLicense !== inputs.bs2TaLicense) {
        setInputs(prev => ({ ...prev, bs2TaLicense: meta.bs2TaLicense || undefined }));
      }
      if (!!meta.bs2VisitorLicense !== !!inputs.bs2VisitorLicense) {
        setInputs(prev => ({ ...prev, bs2VisitorLicense: !!meta.bs2VisitorLicense }));
      }

      const newFeatures = { ...features };

      if (meta.activationCode) {
        const mapping = (MIGRATION_MAPPING.AC as any)[meta.activationCode];
        const hasAAC = mapping && !mapping.noMigration && mapping.addons?.includes('ADV_AC');
        const hasSVM = mapping && !mapping.noMigration && mapping.addons?.includes('SVM');
        const hasDIR = mapping && !mapping.noMigration && mapping.addons?.includes('DIR');
        newFeatures.globalApb = hasAAC;
        newFeatures.fire = hasAAC;
        newFeatures.elevator = hasAAC;
        newFeatures.interlock = hasAAC;
        newFeatures.intrusion = hasAAC;
        newFeatures.mustering = hasAAC;
        newFeatures.occupancy = hasAAC;
        newFeatures.serverMatching = hasSVM;
        newFeatures.directory = hasDIR;
      } else {
        newFeatures.globalApb = false;
        newFeatures.fire = false;
        newFeatures.elevator = false;
        newFeatures.interlock = false;
        newFeatures.intrusion = false;
        newFeatures.mustering = false;
        newFeatures.occupancy = false;
        newFeatures.serverMatching = false;
        newFeatures.directory = false;
      }

      const taMapping = meta.bs2TaLicense ? (MIGRATION_MAPPING.TA as any)[meta.bs2TaLicense] : null;
      if (meta.bs2TaLicense && taMapping) {
        newFeatures.tna = true;
      } else if (!meta.bs2TaLicense) {
        newFeatures.tna = false;
      }
      newFeatures.visitor = !!meta.bs2VisitorLicense;

      const shouldMobile = meta.bs2UsesApp || meta.bs2AppSameNetwork || meta.bs2AppOutsideNetwork;
      const shouldRemote = meta.bs2UsesCloud || meta.bs2AppOutsideNetwork;

      if (shouldMobile) {
        newFeatures.mobile = true;
      } else {
        newFeatures.mobile = false;
      }
      if (shouldRemote) {
        newFeatures.remote = true;
      } else {
        newFeatures.remote = false;
      }

      setFeatures(newFeatures);
    }
  }, [meta.activationCode, meta.bs2TaLicense, meta.bs2VisitorLicense, meta.bs2UsesCloud, meta.bs2UsesApp, meta.bs2AppSameNetwork, meta.bs2AppOutsideNetwork, inputs.scenario, inputs.activationCode, inputs.bs2TaLicense, inputs.bs2VisitorLicense]);

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
    <div className="min-h-screen p-4 lg:p-10 max-w-[1680px] mx-auto animate-fadeIn pb-24 xl:pb-10" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 400 }}>
      <Header 
        scenario={inputs.scenario} 
        onReset={handleReset} 
        calculatedBOM={calculatedBOM}
        meta={meta}
        onGenerateReport={handleGenerateReport}
        hasCapacityData={hasCapacityData}
      />

      <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 items-start">
        <div className="w-full xl:w-[68%] space-y-6 sm:space-y-8">
          <ProjectMetadataForm meta={meta} onChange={setMeta} />
          
          {inputs.scenario === 'migration' && (
            <MigrationValidation meta={meta} onChange={setMeta} />
          )}
          
          <CapacityInputs inputs={inputs} onChange={setInputs} sectionNumber={inputs.scenario === 'migration' ? 3 : 2} />
          
          <FeaturesSection 
            inputs={inputs}
            features={features}
            onInputsChange={setInputs}
            onFeaturesChange={setFeatures}
            bs2VisitorLocked={inputs.scenario === 'migration' && !!meta.bs2VisitorLicense}
            bs2TnaLocked={inputs.scenario === 'migration' && !!meta.bs2TaLicense}
            bs2MobileLocked={inputs.scenario === 'migration' && (!!meta.bs2UsesApp || !!meta.bs2AppSameNetwork || !!meta.bs2AppOutsideNetwork)}
            bs2RemoteLocked={inputs.scenario === 'migration' && (!!meta.bs2UsesCloud || !!meta.bs2AppOutsideNetwork)}
          />
          
          <DeviceLicenses inputs={inputs} onChange={setInputs} />
        </div>

        <div className="hidden xl:block w-[32%] self-start sticky top-4 z-40 max-h-[calc(100vh-2rem)] overflow-y-auto">
          <BomSidebar 
            calculatedBOM={calculatedBOM}
            onGenerateReport={handleGenerateReport}
            tierChanged={tierChanged}
            meta={meta}
            onSendEmail={() => setShowEmailDialog(true)}
            hasCapacityData={hasCapacityData}
            isMigration={inputs.scenario === 'migration'}
          />
        </div>
      </div>

      <MobileBomSheet 
        calculatedBOM={calculatedBOM}
        onGenerateReport={handleGenerateReport}
        hasCapacityData={hasCapacityData}
        isMigration={inputs.scenario === 'migration'}
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
