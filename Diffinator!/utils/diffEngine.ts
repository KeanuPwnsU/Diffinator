import { DiffLine, DiffBlock, DiffType } from '../types';
import * as Diff from 'diff';

/**
 * Calculates the Levenshtein distance between two strings.
 * Used for fuzzy matching blocks to detect moves.
 */
function similarity(s1: string, s2: string): number {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  
  // Basic edit distance
  const costs = new Array();
  for (let i = 0; i <= shorter.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= longer.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) {
      costs[longer.length] = lastValue;
    }
  }
  
  return (longerLength - costs[longer.length]) / parseFloat(longerLength.toString());
}

export function computeAdvancedDiff(oldText: string, newText: string): DiffBlock[] {
  // 1. Compute Standard Line Diff
  const changes = Diff.diffLines(oldText, newText, { ignoreWhitespace: false });
  
  let originalLineCounter = 1;
  let newLineCounter = 1;
  
  // Temporary storage to organize by raw blocks before move detection
  let blocks: { 
    type: 'add' | 'remove' | 'unchanged', 
    lines: string[], 
    startOld: number, 
    startNew: number 
  }[] = [];

  changes.forEach(change => {
    const lines = change.value.replace(/\n$/, '').split('\n');
    if (change.added) {
      blocks.push({ 
        type: 'add', 
        lines, 
        startOld: -1, 
        startNew: newLineCounter 
      });
      newLineCounter += lines.length;
    } else if (change.removed) {
      blocks.push({ 
        type: 'remove', 
        lines, 
        startOld: originalLineCounter, 
        startNew: -1 
      });
      originalLineCounter += lines.length;
    } else {
      blocks.push({ 
        type: 'unchanged', 
        lines, 
        startOld: originalLineCounter, 
        startNew: newLineCounter 
      });
      originalLineCounter += lines.length;
      newLineCounter += lines.length;
    }
  });

  // 2. Heuristic Move Detection
  // We look for 'remove' blocks and 'add' blocks that are highly similar.
  const removedBlocks = blocks.filter(b => b.type === 'remove');
  const addedBlocks = blocks.filter(b => b.type === 'add');
  
  const moves = new Map<number, number>(); // Map removedBlockIndex -> addedBlockIndex

  removedBlocks.forEach((remBlock, remIdx) => {
    const remContent = remBlock.lines.join('\n').trim();
    if (remContent.length < 5) return; // Ignore tiny fragments

    let bestMatchIdx = -1;
    let bestScore = 0;

    addedBlocks.forEach((addBlock, addIdx) => {
       // Prevent multiple mapping
       // (In a full implementation we'd track used added blocks, but strictly speaking 
       // a block *could* be duplicated, so we allow 1-to-many from src perspective, 
       // but typically code moves are 1-to-1. We'll stick to simple best match).
       const addContent = addBlock.lines.join('\n').trim();
       const score = similarity(remContent, addContent);
       
       if (score > 0.8 && score > bestScore) { // 80% similarity threshold
         bestScore = score;
         bestMatchIdx = addIdx;
       }
    });

    if (bestMatchIdx !== -1) {
       // Tag the blocks in the main array
       // We need to find the specific block objects in the main 'blocks' array
       // Since 'blocks' objects are references, we can mutate them later if we tracked indices,
       // but we filtered. Let's do a direct lookup or just re-iterate.
       // Optimization: Store a 'moved' property on the temporary block object.
       (remBlock as any).isMoveOut = true;
       (remBlock as any).pairedId = `move-${remIdx}-${bestMatchIdx}`;
       (addedBlocks[bestMatchIdx] as any).isMoveIn = true;
       (addedBlocks[bestMatchIdx] as any).pairedId = `move-${remIdx}-${bestMatchIdx}`;
    }
  });

  // 3. Construct Final DiffBlocks
  const finalBlocks: DiffBlock[] = blocks.map((block, index) => {
    let type: DiffType = block.type as DiffType;
    if ((block as any).isMoveOut) type = 'move_out';
    if ((block as any).isMoveIn) type = 'move_in';

    const lines: DiffLine[] = block.lines.map((content, lineIdx) => ({
      content,
      type,
      originalIndex: block.startOld !== -1 ? block.startOld + lineIdx : null,
      newIndex: block.startNew !== -1 ? block.startNew + lineIdx : null,
      id: (block as any).pairedId
    }));

    return {
      id: `diff-block-${index}`,
      type,
      lines,
      startLineOriginal: block.startOld,
      startLineNew: block.startNew
    };
  });

  // Merge adjacent 'unchanged' blocks if they exist (optimization)
  // Actually, we want granular blocks for the screenshotter, but 
  // keeping structure is fine. The crucial part is identifying logic blocks.
  
  return finalBlocks;
}
