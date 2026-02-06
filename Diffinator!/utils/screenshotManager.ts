import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { DiffBlock } from '../types';

export async function captureAndZipHunks(
  blocks: DiffBlock[], 
  geminiSummary: string | null
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder("apex_diff_intelligence");
  
  if (!folder) throw new Error("Failed to create zip folder");

  // 1. Identify relevant blocks (Moves, Adds, Removes)
  // We skip 'unchanged' blocks to save tokens, unless they provide context?
  // The prompt says "only the diff slices... that actually has changes".
  const changedBlocks = blocks.filter(b => b.type !== 'unchanged');

  if (changedBlocks.length === 0) {
    alert("No changes detected to capture.");
    return;
  }

  // 2. Capture Loop
  for (let i = 0; i < changedBlocks.length; i++) {
    const block = changedBlocks[i];
    const element = document.getElementById(block.id);
    
    if (element) {
      try {
        // High fidelity capture
        const canvas = await html2canvas(element, {
          backgroundColor: null, // Transparent background if possible, or inherit
          scale: 2, // Retina quality for Vision model clarity
          logging: false,
          ignoreElements: (el) => el.classList.contains('no-capture')
        });

        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        
        if (blob) {
          // Filename: type_lines_index.png
          const startLine = block.startLineOriginal !== -1 ? block.startLineOriginal : block.startLineNew;
          const fileName = `${i + 1}_${block.type}_line${startLine}.png`;
          folder.file(fileName, blob);
        }
      } catch (err) {
        console.error(`Failed to capture block ${block.id}`, err);
      }
    }
  }

  // 3. Add Gemini Summary if exists
  if (geminiSummary) {
    folder.file("gemini_change_analysis.txt", geminiSummary);
  }

  // 4. Generate and Download
  const content = await zip.generateAsync({ type: "blob" });
  const url = window.URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = "Apex_Diff_Intelligence_Set.zip";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
