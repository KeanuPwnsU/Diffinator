export type DiffType = 'unchanged' | 'add' | 'remove' | 'move_in' | 'move_out';

export interface DiffLine {
  content: string;
  type: DiffType;
  originalIndex: number | null;
  newIndex: number | null;
  id?: string; // Unique ID for finding paired moves
}

export interface DiffBlock {
  id: string; // DOM ID for screenshot targeting
  type: DiffType;
  lines: DiffLine[];
  startLineOriginal: number | null;
  startLineNew: number | null;
}

export interface AppState {
  originalCode: string;
  newCode: string;
  isProcessing: boolean;
  geminiEnabled: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface GeminiSummaryResult {
  summary: string;
  success: boolean;
}
