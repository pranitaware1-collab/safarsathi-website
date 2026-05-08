# SafarSathi Tourism - Full Stack Project

This is a full-stack application built with React (Vite) on the frontend and Express on the backend.

## Local Development Setup

To run this project on your local machine in Visual Studio Code, follow these steps:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 2. Installation
Open your terminal in the project folder and run:
```bash
npm install
```

### 3. Environment Configuration
1. Create a new file named `.env` in the root directory.
2. Copy the contents of `.env.example` into your new `.env` file.
3. Fill in your API keys and secrets:
   - **GEMINI_API_KEY**: Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
   - **EMAIL_USER/PASS**: For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833).
   - **TWILIO**: Get your credentials from the [Twilio Console](https://www.twilio.com/console).

### 4. Running the App
To start the development server (both frontend and backend):
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### 5. Production Build
To build the app for production:
```bash
npm run build
```
To start the production server:
```bash
npm run start
```

## Project Structure
- `server.ts`: Express backend server (handles API routes and Vite middleware).
- `src/`: React frontend source code.
- `public/`: Static assets.
- `dist/`: Production build output (generated after `npm run build`).
- `DestinationContext.tsx`: Manages trip data persistence using `localStorage`.

## Admin Panel
- **Login**: `/admin/login`
- **Dashboard**: `/admin/dashboard`
- **Default Admin**: Suyog Aware (Admin Panel) / Pranit Aware (Developer)

## Persistence
Trip data (adding/editing/deleting) is saved in your browser's `localStorage`. This means your changes will stay even if you refresh the page or restart the server locally.
