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
  // We skip 'unchanged' blocks to save tokens.
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
          backgroundColor: '#0a0a0c', // Force dark background to match theme (prevent blank/transparent images)
          scale: 2, // Retina quality
          logging: false,
          ignoreElements: (el) => el.classList.contains('no-capture'),
          useCORS: true // Ensure external assets (fonts) load if possible
        });

        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        
        if (blob) {
          // Filename: index_type_line.png
          // Ensure file names sort correctly (padding index if needed, but standard sort handles numbers well in most OS)
          // We'll pad the index to 3 digits for military precision sorting
          const indexStr = (i + 1).toString().padStart(3, '0');
          const startLine = block.startLineOriginal !== -1 ? block.startLineOriginal : block.startLineNew;
          const fileName = `${indexStr}_${block.type}_line${startLine}.png`;
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
