import React from 'react';
import { AppState } from '../types';

interface ControlPanelProps {
  state: AppState;
  setOriginalCode: (code: string) => void;
  setNewCode: (code: string) => void;
  toggleGemini: () => void;
  onExport: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  setOriginalCode,
  setNewCode,
  toggleGemini,
  onExport
}) => {
  return (
    <div className="bg-apex-panel border-b border-apex-border p-4 flex flex-col gap-4 shadow-2xl z-10">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-xl font-bold text-apex-accent tracking-tighter">APEX DIFF-VISION <span className="text-xs text-gray-500 font-normal">PROTOCOL V1</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Gemini Toggle */}
           <button 
             onClick={toggleGemini}
             className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${
               state.geminiEnabled 
                 ? 'bg-apex-accent/10 border-apex-accent text-apex-accent shadow-[0_0_15px_rgba(0,240,255,0.3)]' 
                 : 'bg-transparent border-gray-600 text-gray-500 hover:border-gray-400'
             }`}
           >
             Gemini 3 Flash: {state.geminiEnabled ? 'ON' : 'OFF'}
           </button>

           {/* Export Button */}
           <button 
             onClick={onExport}
             disabled={state.isProcessing}
             className="bg-apex-success text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#00cc7d] transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(0,255,157,0.4)]"
           >
             {state.isProcessing ? 'PROCESSING...' : 'EXPORT INTELLIGENCE PACKAGE'}
           </button>
        </div>
      </div>

      {/* Input Areas */}
      <div className="grid grid-cols-2 gap-4 h-32">
        <div className="relative group">
            <textarea
                placeholder="Paste ORIGINAL Code Here..."
                className="w-full h-full bg-black/50 border border-apex-border p-3 text-xs font-mono text-gray-300 focus:border-apex-accent focus:outline-none resize-none transition-colors"
                value={state.originalCode}
                onChange={(e) => setOriginalCode(e.target.value)}
            />
            <div className="absolute top-0 right-0 bg-apex-border text-xs px-2 py-0.5 text-gray-500">ORIGINAL</div>
        </div>
        <div className="relative group">
            <textarea
                placeholder="Paste NEW Code Here..."
                className="w-full h-full bg-black/50 border border-apex-border p-3 text-xs font-mono text-gray-300 focus:border-apex-success focus:outline-none resize-none transition-colors"
                value={state.newCode}
                onChange={(e) => setNewCode(e.target.value)}
            />
            <div className="absolute top-0 right-0 bg-apex-border text-xs px-2 py-0.5 text-gray-500">NEW</div>
        </div>
      </div>
    </div>
  );
};
