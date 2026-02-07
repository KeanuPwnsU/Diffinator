<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Operation Native Shell: Apex Diff-Vision Protocol

This project has been upgraded to a **Military-Grade Desktop Application** using Electron. It runs locally on your machine, free from browser constraints.

## 1. Installation (First Time Setup)

Open your terminal in the project directory and run:

```bash
npm install
```
*This installs all necessary dependencies, including the Electron runtime and build tools.*

## 2. Running Locally (Development Mode)

To start the application in "Dev Mode" (with hot-reloading enabled):

```bash
npm run electron:dev
```
*This will launch the local Vite server and open the desktop application window.*

## 3. Building the Executable (Production)

To compile the application into a standalone `.exe` (Windows), `.dmg` (Mac), or `.AppImage` (Linux):

```bash
npm run dist
```

**Output Location:**
The installer/executable will be generated in the `release/` directory.
- **Windows:** `release/ApexDiffVision Setup 1.0.0.exe`
- **Mac:** `release/ApexDiffVision-1.0.0.dmg`

## 4. Configuration

**API Keys:**
Ensure your `.env.local` file is present in the root directory if you plan to use Gemini AI features.
```
GEMINI_API_KEY=your_key_here
```

## Troubleshooting

- **Blank Screen?** Ensure you ran `npm install` to get the latest dependencies.
- **Build Errors?** If `npm run dist` fails, ensure you are not running it inside a restricted environment (like a web container). It works best on a real Windows/Mac machine.
