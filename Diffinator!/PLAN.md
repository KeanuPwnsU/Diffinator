# OPERATION: APEX DIFF-VISION PROTOCOL
## CLASSIFIED: PRESIDENTIAL EYES ONLY

### 1. Executive Summary
Mr. President, we are pivoting the "C++ Diff Editor" concept into a deployed **React/TypeScript Web Application**. Why? Because the DOM (Document Object Model) offers superior, pixel-perfect control for our "Smart Screenshot" objective compared to raw C++/Qt painting in a browser environment. This allows us to surgically capture *only* the diff hunks as lightweight images, minimizing token usage for your Gemini conversations, just as you ordered.

We are building a **Split-Screen Diff Engine** with a dedicated **Token-Optimized Export Pipeline**.

### 2. Core Directives (The "Hardened" Requirements)
1.  **Visual Diff View:**
    *   Left Panel: Original Code.
    *   Right Panel: New Code.
    *   **Color Logic (Strict):**
        *   Moves (Original): **Light Red**
        *   Removals: **Dark Red**
        *   Moves (New): **Light Green**
        *   Additions: **Dark Green**
    *   Synchronized Scrolling: Both panels move as one.

2.  **Smart Vision Capture (The "Killer Feature"):**
    *   **Objective:** Export a ZIP file containing screenshots of *only* the changed sections.
    *   **Strategy:** We will not screenshot the whole screen. We will isolate the specific DOM nodes containing changes (the "hunks").
    *   **Token Optimization:** By cropping strictly to the changes, we reduce image dimensions significantly (e.g., from 1920x1080 to multiple 600x150 strips). This ensures Gemini Vision sees the text clearly without wasting tokens on whitespace or unchanged code.
    *   **Format:** Images saved as high-contrast PNGs.

3.  **Gemini 3 Flash Integration (The "Analyst"):**
    *   **Mode:** Toggleable.
    *   **Restricted Purpose:** It does *not* fix code. It *only* reads the raw text of the Old/New files and generates a `changes_summary.txt`.
    *   **Output:** This text file is bundled into the ZIP with the screenshots.
    *   **Model:** `gemini-3-flash-preview`.

### 3. Architecture & Tech Stack
*   **Core:** React 18, TypeScript, Vite.
*   **Styling:** Tailwind CSS (for rapid, aggressive UI styling).
*   **Diffing Algorithm:** `diff` (NPM package) for line-by-line comparison + Custom Heuristic Layer for "Move" detection (Levenshtein distance checks on removed vs added blocks).
*   **Screenshot Engine:** `html2canvas`. It allows us to target specific `<div>` references (the diff hunks) and render them to canvas blobs programmatically.
*   **Compression:** `jszip` to bundle the images and text report.
*   **AI:** `@google/genai` SDK.

### 4. Logic Flowchart

```mermaid
graph TD
    A[Start: User Pastes Old & New Code] --> B{Process Diff}
    B --> C[Compute Standard Line Diff]
    C --> D[Heuristic Pass: Detect Moves]
    D -->|Match Removed/Added blocks > 70% similarity| E[Mark as MOVES (Light Red/Green)]
    D -->|No Match| F[Mark as Add/Delete (Dark Red/Green)]
    
    F & E --> G[Render Split View UI]
    G --> H[User Clicks 'EXPORT INTELLIGENCE PACKAGE']
    
    H --> I{Gemini Toggle ON?}
    
    I -- Yes --> J[Call Gemini 3 Flash API]
    J --> K[Generate changes_summary.txt]
    I -- No --> L[Skip AI Analysis]
    
    K & L --> M[Smart Capture Sequence]
    M --> N[Identify Changed 'Hunks']
    N --> O[Loop through Hunks]
    O --> P[Render Hunk to Off-screen Canvas]
    P --> Q[Convert to Blob (PNG)]
    Q --> R[Add to ZIP]
    
    R --> S[Download 'Diff_Intelligence_Set.zip']
    S --> T[Mission Complete: User drags ZIP to External Chat]
```

### 5. File Structure Strategy (The Blueprint)

These are the files we will deploy in the next phase.

*   `index.html`: The entry vector.
*   `index.tsx`: React mounting point.
*   `App.tsx`: The Command Center (Main Layout).
*   `types.ts`: TypeScript definitions for Diff objects, Themes, and API states.
*   `constants.ts`: Color definitions (Light Red, Dark Red, etc.) and configuration limits.
*   `utils/diffEngine.ts`: **CRITICAL.** Contains the logic to compute diffs and identify "Moves". This is where the brain lives.
*   `utils/screenshotManager.ts`: **CRITICAL.** Handles `html2canvas` operations, targeted DOM capturing, and `jszip` bundling.
*   `utils/geminiService.ts`: Handles the connection to `gemini-3-flash-preview` for the text report.
*   `components/DiffViewer.tsx`: The dual-pane visualizer. Handles synchronized scrolling and rendering the `DiffLine` components.
*   `components/DiffLine.tsx`: Individual line renderer. Must be optimized for performance (thousands of lines).
*   `components/ControlPanel.tsx`: The sticky header containing the "Analyze" and "Export" triggers.
*   `components/Spinner.tsx`: Visual feedback during the capture process (which can take 1-2 seconds).

### 6. The "Move" Detection Algorithm (Detail)
Standard diff utilities only see "Insert" and "Delete". To achieve your specific color requirements, we will implement a post-processor:
1.  Run standard `diffChars` or `diffLines`.
2.  Collect all "Removed" chunks and "Added" chunks.
3.  Compare every Removed chunk against every Added chunk.
4.  If `Similarity(Removed, Added) > Threshold`:
    *   Re-label Removed chunk as "MOVE_OUT" (Light Red).
    *   Re-label Added chunk as "MOVE_IN" (Light Green).
    *   (Optional) Assign them a matching ID to highlight them together on hover.

### 7. Token Optimization Mathematics
*   **Standard Screenshot:** 1920x1080 ≈ 2 Megapixels. High token cost. High noise (unchanged code).
*   **Apex Smart Capture:**
    *   We capture only the *delta*.
    *   If lines 50-55 changed, we capture a 800x120px strip.
    *   If there are 5 such changes, we generate 5 small strips.
    *   Total pixel area might be ~10% of the screen.
    *   **Result:** Gemini Vision consumes significantly fewer tokens and focuses *purely* on the syntax changes.

### 8. Presidential Approval Required
Mr. President, this plan adheres strictly to your "Diff-Only" philosophy for the program, relegating the AI to a reporter role and focusing the main engineering effort on the **Smart Screenshot** pipeline.

**Awaiting your command to commence coding.**
(Note: Per your instructions, I have halted here. To proceed, simply give the order, and I will generate the React application files outlined above.)
