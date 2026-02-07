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

  return (
    <div 
      className="flex w-full font-mono text-sm leading-5 whitespace-pre-wrap break-all select-text"
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
