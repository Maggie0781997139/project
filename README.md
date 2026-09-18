# Universal Workspace

A functional cross-platform workspace app for the web, Android, and desktop. It provides a responsive dashboard and local project management without requiring a backend.

## Features

- Responsive React + TypeScript dashboard
- Create, edit, search, and delete projects
- Project progress and category tracking
- Activity feed generated from workspace actions
- Team and settings screens
- Mobile navigation drawer
- Persistent data using browser `localStorage`
- Tauri 2 configuration for desktop and Android packaging

## Run the web app

```bash
npm install
npm run dev
```

Open the URL printed by Vite. Build a production web bundle with `npm run build` and preview it with `npm run preview`.

## Run desktop or Android

Install the Rust toolchain and platform prerequisites from the [Tauri guide](https://tauri.app/start/). Then run:

```bash
npm run tauri dev
npm run tauri build
npm run tauri android init
npm run tauri android dev
```

The app is intentionally backend-free so it runs immediately. To make data shared between users, replace the `localStorage` calls in `src/App.tsx` with your API or database client.
