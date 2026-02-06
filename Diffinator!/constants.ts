export const COLORS = {
  bg: {
    moveOut: '#ffcccc', // Light Red (Moves on Original)
    remove: '#ff9999',  // Dark Red (Deletions)
    moveIn: '#ccffcc',  // Light Green (Moves on New)
    add: '#99ff99',     // Dark Green (Additions)
    unchanged: 'transparent'
  },
  text: {
    highlighted: '#000000', // Black text for colored backgrounds to ensure max contrast
    default: '#e2e8f0',     // Light gray for dark mode background
    lineNumber: '#4b5563'
  }
};

export const GEMINI_MODEL = 'gemini-3-flash-preview';

export const SYSTEM_INSTRUCTION = `
You are a Code Evolution Analyst. Your job is to analyze a "diff" between two files and produce a concise, bullet-point summary of changes.
- Focus on Logic: Identify what actually changed in the logic, not just whitespace.
- Categorize: Group findings into "Moves", "Removals", "Additions", and "Modifications".
- Brevity: Be extremely concise. The user is an expert.
- Format: Plain text, bullet points.
`;
