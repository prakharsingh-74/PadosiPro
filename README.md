# PadosiPro — Lifestyle Management Service

Welcome to the PadosiPro full-stack application repository. This project includes an **Express.js REST API Backend** connected to **Supabase (PostgreSQL)** and a **Native Mobile Application** built with **React Native (Expo)**.

---

## 🛠️ Stack & Architecture Overview

- **Backend**: Node.js, Express, TypeScript, Zod, bcrypt, JWT, Nodemailer, Jest.
- **Database**: Supabase PostgreSQL.
- **Mobile**: React Native, Expo Router, TypeScript, Vector Icons.
- **Local Mail Catcher**: Mailpit (captures real SMTP emails locally).
- **Containerization**: Docker Compose (`docker-compose up --build`).

---

## 📋 Prerequisites

Before running the project locally, ensure you have installed:
1. **Node.js** (v18 or v20+)
2. **npm** or **yarn**
3. **Docker & Docker Compose** (for running Mailpit & Backend locally with 1 command)
4. **Expo Go app** on your mobile device (or Android Studio Emulator)

---

## 🚀 Part A: Running Backend Locally (One Documented Command)

### Option 1: Using Docker Compose (Recommended)

From the project root directory, run:

```bash
docker-compose up --build
```

This single command will:
- Spin up **Mailpit** at `http://localhost:8025` (Visual Web UI to inspect outgoing OTP emails).
- Spin up the **Express REST API** at `http://localhost:4000`.

### Option 2: Running Backend Directly via Node.js

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Copy the `.env.example` file:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Seed the database with 20+ tasks across 4 categories:
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 🧪 Running Backend Unit Tests

To run tests for risky logic (OTP generation, SHA-256 hashing, 10-minute expiry, 5-attempt limits, and 30s resend cooldown):

```bash
cd backend
npm test
```

---

## 📱 Part B: Running the Mobile App

1. Navigate to the `mobile` folder:
   ```bash
   cd mobile
   ```
2. Install mobile dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npx expo start
   ```
4. Scan the displayed QR code with your mobile device via **Expo Go** or press `a` to launch the Android emulator.

---

## 📦 How to Build the Android APK

To build the standalone `.apk` file for Android installation:

1. Install Expo Application Services (EAS) CLI globally:
   ```bash
   npm install -g eas-cli
   ```
2. Log into your Expo account:
   ```bash
   eas login
   ```
3. Run the local or cloud APK build command:
   ```bash
   cd mobile
   eas build --platform android --profile preview
   ```
   *Or for local offline build:*
   ```bash
   eas build --platform android --profile preview --local
   ```
   The output `.apk` file will be generated in your build directory.

---

## 📩 Mailpit Web UI (Inspecting OTP Emails)

When a new user registers or requests a resend OTP, the email is sent locally via SMTP to **Mailpit**.
Open `http://localhost:8025` in your browser to view all incoming 6-digit verification codes in real-time.
