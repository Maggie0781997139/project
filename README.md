# Universal Workspace

A responsive cross-platform starter app for the web, Android, and desktop.

## Stack

- React + TypeScript + Vite for the shared UI
- Tauri 2 for desktop and Android packaging
- Responsive CSS for phone, tablet, and desktop layouts

## Getting started

```bash
npm install
npm run dev
```

## Build targets

```bash
# Web
npm run build
npm run preview

# Desktop / Android (requires Rust and Tauri prerequisites)
npm run tauri dev
npm run tauri build
npm run tauri android init
npm run tauri android dev
```

The app currently provides a clean dashboard shell with navigation, task summary cards, activity, and a responsive quick-actions panel. Replace the sample data in `src/App.tsx` with your domain features.
