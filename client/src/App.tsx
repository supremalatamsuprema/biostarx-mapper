import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { LandingPage } from "@/components/LandingPage";
import { Calculator } from "@/pages/Calculator";
import { getShareFromURL, decodeShareState } from "@/lib/share";
import type { ProjectInputs, ProjectMeta, FeatureFlags } from "@/types/license";

interface SharedState {
  meta: Partial<ProjectMeta>;
  inputs: Partial<ProjectInputs>;
  features: FeatureFlags;
}

function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [scenario, setScenario] = useState<ProjectInputs['scenario']>('');
  const [sharedState, setSharedState] = useState<SharedState | null>(null);

  useEffect(() => {
    const shareParam = getShareFromURL();
    if (shareParam) {
      const decoded = decodeShareState(shareParam);
      if (decoded && decoded.inputs.scenario) {
        setSharedState(decoded);
        setScenario(decoded.inputs.scenario as ProjectInputs['scenario']);
        setDisclaimerAccepted(true);
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, []);

  const handleAcceptDisclaimer = () => {
    setDisclaimerAccepted(true);
  };

  const handleSelectScenario = (selectedScenario: ProjectInputs['scenario']) => {
    setScenario(selectedScenario);
  };

  const handleReset = () => {
    setScenario('');
    setSharedState(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <I18nProvider>
          <DisclaimerModal 
            open={!disclaimerAccepted} 
            onAccept={handleAcceptDisclaimer} 
          />
          
          {disclaimerAccepted && (
            <>
              {!scenario ? (
                <LandingPage onSelectScenario={handleSelectScenario} />
              ) : (
                <Calculator scenario={scenario} onReset={handleReset} sharedState={sharedState} />
              )}
            </>
          )}
          
          <Toaster />
        </I18nProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
