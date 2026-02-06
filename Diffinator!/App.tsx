import React, { useState, useMemo, useCallback } from 'react';
import { AppState, DiffBlock } from './types';
import { computeAdvancedDiff } from './utils/diffEngine';
import { captureAndZipHunks } from './utils/screenshotManager';
import { generateGeminiSummary } from './utils/geminiService';
import { ControlPanel } from './components/ControlPanel';
import { DiffViewer } from './components/DiffViewer';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    originalCode: '',
    newCode: '',
    isProcessing: false,
    geminiEnabled: false,
    error: null,
    successMessage: null
  });

  // Memoize diff computation to avoid re-runs on unrelated renders
  const diffBlocks: DiffBlock[] = useMemo(() => {
    if (!state.originalCode && !state.newCode) return [];
    return computeAdvancedDiff(state.originalCode, state.newCode);
  }, [state.originalCode, state.newCode]);

  const handleExport = useCallback(async () => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    // Allow UI to update (render spinner) before blocking thread with canvas ops
    setTimeout(async () => {
        try {
            let summary: string | null = null;
            
            if (state.geminiEnabled) {
                summary = await generateGeminiSummary(state.originalCode, state.newCode);
            }

            await captureAndZipHunks(diffBlocks, summary);
            
            setState(prev => ({ ...prev, isProcessing: false, successMessage: "Intelligence Package Exported Successfully." }));
            setTimeout(() => setState(prev => ({ ...prev, successMessage: null })), 3000);
            
        } catch (e: any) {
            setState(prev => ({ ...prev, isProcessing: false, error: e.message || "Export failed." }));
        }
    }, 100);
  }, [state.originalCode, state.newCode, state.geminiEnabled, diffBlocks]);

  return (
    <div className="h-screen flex flex-col bg-apex-bg text-apex-text font-mono">
      <ControlPanel 
        state={state}
        setOriginalCode={(c) => setState(prev => ({ ...prev, originalCode: c }))}
        setNewCode={(c) => setState(prev => ({ ...prev, newCode: c }))}
        toggleGemini={() => setState(prev => ({ ...prev, geminiEnabled: !prev.geminiEnabled }))}
        onExport={handleExport}
      />
      
      <div className="flex-1 relative overflow-hidden">
        {diffBlocks.length > 0 ? (
            <DiffViewer blocks={diffBlocks} />
        ) : (
            <div className="flex items-center justify-center h-full text-gray-700 select-none">
                <div className="text-center">
                    <div className="text-4xl mb-4 opacity-20 font-bold">AWAITING DATA</div>
                    <div className="text-sm opacity-40">PASTE CODE TO INITIALIZE DIFF ENGINE</div>
                </div>
            </div>
        )}
      </div>

      {state.isProcessing && <Spinner />}
      
      {state.error && (
        <div className="fixed bottom-4 right-4 bg-apex-danger text-white px-6 py-4 border border-red-500 shadow-xl z-50">
            <div className="font-bold text-xs uppercase mb-1">Error</div>
            {state.error}
        </div>
      )}
      
      {state.successMessage && (
        <div className="fixed bottom-4 right-4 bg-apex-success text-black px-6 py-4 border border-green-500 shadow-xl z-50">
             <div className="font-bold text-xs uppercase mb-1">Status</div>
            {state.successMessage}
        </div>
      )}
    </div>
  );
};

export default App;
