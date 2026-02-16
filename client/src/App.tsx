import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { LandingPage } from "@/components/LandingPage";
import { Calculator } from "@/pages/Calculator";
import type { ProjectInputs } from "@/types/license";

function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [scenario, setScenario] = useState<ProjectInputs['scenario']>('');

  const handleAcceptDisclaimer = () => {
    setDisclaimerAccepted(true);
  };

  const handleSelectScenario = (selectedScenario: ProjectInputs['scenario']) => {
    setScenario(selectedScenario);
  };

  const handleReset = () => {
    setScenario('');
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
                <Calculator scenario={scenario} onReset={handleReset} />
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
