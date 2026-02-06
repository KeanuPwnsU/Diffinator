import React, { useEffect, useRef } from 'react';
import { DiffBlock } from '../types';
import { DiffLine } from './DiffLine';

interface DiffViewerProps {
  blocks: DiffBlock[];
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ blocks }) => {
  const scrollRefLeft = useRef<HTMLDivElement>(null);
  const scrollRefRight = useRef<HTMLDivElement>(null);
  
  // Synchronized Scrolling
  useEffect(() => {
    const left = scrollRefLeft.current;
    const right = scrollRefRight.current;
    if (!left || !right) return;

    const handleScrollLeft = () => { right.scrollTop = left.scrollTop; };
    const handleScrollRight = () => { left.scrollTop = right.scrollTop; };

    left.addEventListener('scroll', handleScrollLeft);
    right.addEventListener('scroll', handleScrollRight);

    return () => {
      left.removeEventListener('scroll', handleScrollLeft);
      right.removeEventListener('scroll', handleScrollRight);
    };
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden h-full bg-apex-bg relative border-t border-apex-border">
      {/* Container for split view */}
      
      {/* Left Panel: Original */}
      <div ref={scrollRefLeft} className="w-1/2 overflow-y-auto border-r border-apex-border custom-scrollbar">
        <div className="min-h-full">
          {blocks.map((block) => {
            // Logic: If block is ADD, it doesn't exist on Left (render placeholders)
            // If block is REMOVE or MOVE_OUT or UNCHANGED, it exists on Left.
            
            const isVisibleOnLeft = ['unchanged', 'remove', 'move_out'].includes(block.type);
            
            return (
              <div 
                key={`${block.id}-left`} 
                id={block.type !== 'unchanged' ? block.id : undefined} // Only ID changed blocks for capture
                className={block.type !== 'unchanged' ? "diff-hunk mb-1 ring-1 ring-inset ring-black/10" : ""}
              >
                {block.lines.map((line, idx) => (
                  <DiffLine 
                    key={idx} 
                    line={isVisibleOnLeft ? line : { ...line, content: '', type: 'unchanged', originalIndex: null }} 
                    isLeft={true} 
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel: New */}
      <div ref={scrollRefRight} className="w-1/2 overflow-y-auto custom-scrollbar">
         <div className="min-h-full">
          {blocks.map((block) => {
            // Logic: If block is REMOVE, it doesn't exist on Right
            const isVisibleOnRight = ['unchanged', 'add', 'move_in'].includes(block.type);
            
            return (
              <div 
                key={`${block.id}-right`}
                // We don't ID the right side separately for the "hunk" logic in this specific screenshot strategy.
                // The strategy captures the ID. Since we are using Split View, "block.id" appears twice in the DOM?
                // Correction: DOM IDs must be unique.
                // We need to capture BOTH sides if they differ.
                // Or better: The prompt implies a combined "screenshot set... of the diff that actually has changes".
                // We should capture the ROW (both left and right side) for the changed hunk.
                // So we need a WRAPPER around both left and right?
                // React structure prevents wrapping both left/right easily in a row-based layout if we use two separate scroll containers.
                
                // ADJUSTMENT for "Smart Screenshot":
                // If we screenshot just one side, we lose context.
                // We need to capture the *visual representation* the user sees.
                // Since `html2canvas` captures a DOM node, and our nodes are split far apart in the DOM tree (Left Column / Right Column),
                // we cannot easily capture "Row 5 Left + Row 5 Right" as a single image unless they are in a common container.
                
                // SOLUTION:
                // We will render the diff as ROWS of (Left Cell | Right Cell).
                // This makes synchronization trivial and screenshots easy.
                // However, the prompt asked for "Left: Old, Right: New... synchronized vertical scrolling".
                // Row-based layout satisfies this perfectly and makes capturing easier.
                // Let's refactor the render loop below to be Row-Based.
                
                // NO, wait. Row-based layout breaks if we just iterate blocks because a "Remove" block on left might align with an "Add" block on right?
                // Standard diff viewers (like GitHub split) line them up. 
                // Our `DiffEngine` produces blocks.
                // If we have an "Add" block, it inserts lines on right, displacing nothing on left? No, usually it pushes content down or sits next to empty space.
                // For this tool, simplicity is key.
                // We will use a SINGLE container with Flex rows.
                
                 className=""
              >
                 {/* This section is unused in the row-based approach below */}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 
         OVERRIDE: Implementing Row-Based Layout for superior Screenshot capability. 
         This replaces the independent columns above.
      */}
      <div className="absolute inset-0 overflow-y-auto custom-scrollbar bg-apex-bg" ref={scrollRefLeft}>
         {blocks.map((block) => {
           // For each block, we render the Left content and Right content side-by-side.
           // If it's an ADD, Left is empty.
           // If it's a REMOVE, Right is empty.
           // If it's UNCHANGED, Both present.
           
           const isChange = block.type !== 'unchanged';
           
           return (
             <div 
                key={block.id} 
                id={isChange ? block.id : undefined} // This ID wraps the WHOLE row (Left + Right). Perfect for screenshot.
                className={`flex w-full ${isChange ? 'diff-hunk' : ''}`}
             >
               {/* Left Half */}
               <div className="w-1/2 border-r border-apex-border">
                 {block.lines.map((line, idx) => {
                    const showLeft = ['unchanged', 'remove', 'move_out'].includes(block.type);
                    return (
                        <DiffLine 
                            key={`left-${idx}`}
                            line={showLeft ? line : { ...line, content: ' ', type: 'unchanged', originalIndex: null }}
                            isLeft={true}
                        />
                    );
                 })}
               </div>
               
               {/* Right Half */}
               <div className="w-1/2">
                 {block.lines.map((line, idx) => {
                    const showRight = ['unchanged', 'add', 'move_in'].includes(block.type);
                    return (
                        <DiffLine 
                            key={`right-${idx}`}
                            line={showRight ? line : { ...line, content: ' ', type: 'unchanged', newIndex: null }}
                            isLeft={false}
                        />
                    );
                 })}
               </div>
             </div>
           );
         })}
      </div>

    </div>
  );
};
