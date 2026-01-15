import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { LandingPage } from "@/components/LandingPage";
import { Calculator } from "@/pages/Calculator";
import type { ProjectInputs } from "@/types/license";

function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [scenario, setScenario] = useState<ProjectInputs['scenario']>('');

  useEffect(() => {
    const accepted = localStorage.getItem('biostarx-disclaimer-accepted');
    if (accepted === 'true') {
      setDisclaimerAccepted(true);
    }
  }, []);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('biostarx-disclaimer-accepted', 'true');
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
