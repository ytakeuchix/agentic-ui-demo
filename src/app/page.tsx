'use client';

import { DemoProvider, useDemo } from '@/lib/DemoContext';
import { SlackShell } from '@/components/shell/SlackShell';
import { SimulationControl } from '@/components/shell/SimulationControl';
import { DailySummaryCard } from '@/components/agent/DailySummaryCard';
import { CorrectionForm } from '@/components/agent/CorrectionForm';
import { EvidenceMatcher } from '@/components/canvas/EvidenceMatcher';

// Inner component to access context
function DemoApp() {
  const { currentScenario } = useDemo();

  return (
    <SlackShell>
      {/* Simulation Control Panel */}
      <SimulationControl />

      {/* Main Chat Stream Area */}
      <div className="flex-1 flex flex-col justify-start p-6 space-y-6 pb-20">
        {/* Placeholder for scenarios */}
        {currentScenario === 'idle' && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
            Waiting for Agent Trigger... <br />
            (Use the controller to simulate daily summary)
          </div>
        )}

        {/* ZeroUI Notification Phase */}
        {(currentScenario === 'notification' || currentScenario === 'gen-ui' || currentScenario === 'canvas') && (
          <DailySummaryCard />
        )}

        {/* GenUI Correction Phase */}
        {currentScenario === 'gen-ui' && (
          <CorrectionForm />
        )}

        {/* Canvas Phase (Overlay) */}
        {currentScenario === 'canvas' && (
          <EvidenceMatcher />
        )}

        {/* Canvas Phase - Logic handled by Shell or Overlay? 
             Actually, for Canvas, we usually replace the whole view or show a heavy overlay.
             Let's implement a conditional view switcher in the Page component or Shell.
             For now, let's keep it in flow or prepare to hide chat if canvas is active.
         */}

      </div>
    </SlackShell>
  );
}

export default function Page() {
  return (
    <DemoProvider>
      <DemoApp />
    </DemoProvider>
  );
}
