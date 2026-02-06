import React from 'react';
import { DiffBlock } from '../types';
import { DiffLine } from './DiffLine';

interface DiffViewerProps {
  blocks: DiffBlock[];
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ blocks }) => {
  return (
    <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-apex-bg border-t border-apex-border">
      <div className="min-h-full flex flex-col font-mono text-sm">
         {blocks.map((block) => {
           const isChange = block.type !== 'unchanged';
           
           // We render a wrapper for the Block to allow "Hunk" targeting for screenshots
           return (
             <div 
                key={block.id} 
                id={isChange ? block.id : undefined}
                className={`w-full ${isChange ? 'diff-hunk' : ''}`}
             >
               {block.lines.map((line, idx) => {
                 // Determine visibility per side
                 const showLeft = ['unchanged', 'remove', 'move_out'].includes(block.type);
                 const showRight = ['unchanged', 'add', 'move_in'].includes(block.type);

                 return (
                   <div key={`${block.id}-line-${idx}`} className="flex w-full hover:bg-white/5 transition-colors">
                     {/* Left Half */}
                     <div className="w-1/2 border-r border-apex-border relative">
                        <DiffLine 
                            line={showLeft ? line : { ...line, content: ' ', type: 'unchanged', originalIndex: null }}
                            isLeft={true}
                        />
                     </div>

                     {/* Right Half */}
                     <div className="w-1/2 relative">
                        <DiffLine 
                            line={showRight ? line : { ...line, content: ' ', type: 'unchanged', newIndex: null }}
                            isLeft={false}
                        />
                     </div>
                   </div>
                 );
               })}
             </div>
           );
         })}
      </div>
    </div>
  );
};
