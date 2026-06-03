# TechCare Dashboard

A React + Vite healthcare dashboard that displays patient data, diagnostics, and lab results with a polished UI.

## Description

This project is a front-end dashboard built using React and Vite. It fetches patient records from a remote API and renders a patient-focused interface, including:

- patient profile details
- diagnosis history and vital statistics
- diagnostic list with status details
- lab result downloads
- a patient sidebar for quick navigation

The app is designed as a responsive medical dashboard concept that pulls live patient data and refreshes automatically every minute.

## Features

- Fetches patient data from a remote API using authenticated requests
- Automatically displays the selected patient (`Jessica Taylor`) in the main panels
- Sidebar patient list with avatars, name, age, and gender
- Diagnosis history section with a blood pressure chart and recent vital signs
- Diagnostic list table showing condition, description, and status
- Lab results list with download action affordances
- Patient profile card with contact, insurance, and emergency contact information
- Loading and error handling states while fetching data

## Project Structure

- `src/App.jsx` — main app component and data loading logic
- `src/api/patientAPI.js` — fetch logic for patient data
- `src/components/Navbar` — application header and navigation
- `src/components/Sidebar` — patient list sidebar
- `src/components/DiagnosisHistory` — blood pressure chart and vitals section
- `src/components/DiagnosticList` — patient diagnostic table
- `src/components/PatientsProfile` — selected patient profile card
- `src/components/LabResults` — lab results listing

## How to run the project

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Available scripts

- `npm run dev` — start Vite development server
- `npm run build` — build production assets
- `npm run preview` — preview production build locally

## Notes

- The app fetches from `https://fedskillstest.coalitiontechnologies.workers.dev` using basic auth.
- Data is refreshed every 60 seconds to keep the dashboard current.
