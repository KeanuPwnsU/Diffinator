import React from 'react';
import { DiffLine as DiffLineType } from '../types';
import { COLORS } from '../constants';

interface DiffLineProps {
  line: DiffLineType;
  isLeft: boolean; // Is this the left panel (Original)?
}

export const DiffLine: React.FC<DiffLineProps> = ({ line, isLeft }) => {
  let bgColor = COLORS.bg.unchanged;
  let textColor = COLORS.text.default;

  // Color Logic based on "Hardened" Requirements
  if (line.type === 'remove') {
    bgColor = COLORS.bg.remove;
    textColor = COLORS.text.highlighted;
  } else if (line.type === 'add') {
    bgColor = COLORS.bg.add;
    textColor = COLORS.text.highlighted;
  } else if (line.type === 'move_out') {
    bgColor = COLORS.bg.moveOut;
    textColor = COLORS.text.highlighted;
  } else if (line.type === 'move_in') {
    bgColor = COLORS.bg.moveIn;
    textColor = COLORS.text.highlighted;
  }

  // If this is the "Left" panel, we generally show the original state.
  // - Removes show up here.
  // - Moves Out show up here.
  // - Adds do NOT show up here (usually empty or placeholder, but in side-by-side diffs, we usually show empty space)
  
  // However, our DiffBlock structure has separate lines for left/right conceptually?
  // No, the DiffEngine returns a linear sequence of blocks.
  // In a split view, we need to handle alignment. 
  // For this optimized tool, we will render the Block as a whole.
  // If it's an 'add' block, it appears on the Right. The Left gets empty space?
  // If it's a 'remove' block, it appears on the Left. The Right gets empty space.
  
  // Wait, the DiffEngine returns blocks. 
  // To render a split view, the Parent component needs to handle the logic of "What goes on left vs right".
  // This component just renders the visual line.

  return (
    <div 
      className="flex w-full font-mono text-sm leading-5 whitespace-pre break-all select-text"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="w-12 flex-shrink-0 text-right pr-3 select-none opacity-50 text-xs py-[2px]" style={{ color: COLORS.text.lineNumber }}>
        {isLeft ? (line.originalIndex || '') : (line.newIndex || '')}
      </div>
      <div className="py-[2px] flex-1">
        {line.content || ' '}
      </div>
    </div>
  );
};
