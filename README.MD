# CV Generator

## Description
This project generates ATS-compatible CVs in both PDF and HTML formats using JSON as input. The project includes functionalities for keyword highlighting, live reloading during development, and PDF export using Puppeteer.

## Prerequisites
Ensure you have the following installed on your system:
- Node.js (v16 or higher recommended)
- npm (Node Package Manager)

## Installation
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd cv-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development
Run the project in development mode:
```bash
npm run local:watch
```
This will start the Express server and watch for changes in SCSS files, reloading the app as needed.

Access the app in your browser at:
```
http://localhost:3000
```

### Routes
- **`/`**: Preview the CV in HTML format.
- **`/export-pdf`**: Export the CV in PDF format. The generated PDF will be saved as `generated_cv.pdf` in the root directory of the project.

### Important Note
For the application to function correctly, **remove the word "template"** from the names of all template files in the `templates` directory. For example:
- Rename `template.index.hbs` to `index.hbs`.
- Rename `template.main.scss` to `main.scss`.

This ensures the Handlebars templates and SCSS files are correctly recognized and processed.

## Project Structure
```
cv-generator/
├── src/
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── index.scss
│   │   ├── fonts/
│   │   └── data/
│   │       └── index.json
│   ├── templates/
│   │   └── index.hbs
│   ├── highlightedKeywords.ts
│   └── index.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Scripts
- **`npm run local:watch`**: Run the app locally and watch for SCSS changes.

## Dependencies
- `express`: Web server framework
- `handlebars` & `hbs`: Template rendering
- `puppeteer`: For generating PDF files
- `ws`: WebSocket server for live reloading

## Dev Dependencies
- `typescript`: TypeScript support
- `ts-node`: Execute TypeScript files directly
- `sass`: SCSS compilation
- `rimraf`: Cross-platform file removal
- `npm-run-all`: Run multiple npm scripts concurrently

