# PadosiPro Lifestyle Management App

Welcome to the **PadosiPro** mobile application and backend server! This repository contains both the **React Native (Expo) mobile app** and the **Node.js (Express) backend API**. 

The app features a rich, nested "Task Selection" catalogue and a secure OTP-based login system perfectly mimicking modern production apps.

---

## 🛠️ Prerequisites

Before you start, make sure you have the following installed on your computer:
1. **Node.js** (v18 or newer recommended). You can download it from [nodejs.org](https://nodejs.org).
2. **npm** (comes installed automatically with Node.js).
3. **Supabase Account**: You'll need a free account at [Supabase](https://supabase.com) to host the PostgreSQL database.
4. **Expo Go** app on your physical iPhone/Android, or an **Android Studio / iOS Simulator** running on your computer.

---

## ⚙️ Backend Setup (Node.js & Supabase)

The backend handles the business logic, secure OTP generation, and database interactions.

### 1. Database Setup (Supabase)
1. Create a new project in Supabase.
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `backend/src/db/migrations/001_initial_schema.sql` and run the contents in the SQL Editor to create the `users`, `profiles`, and `otps` tables.
4. Open `backend/src/db/migrations/002_add_services.sql` and run it in the SQL Editor to add the `services` column.

### 2. Configure Environment Variables
1. Navigate to the `backend/` folder.
2. You will see a file named `.env.example`. Make a copy of it and name the new file exactly `.env`.
3. Open `.env` and fill in your Supabase credentials:
   - `SUPABASE_URL`: Your Supabase project URL (found in Project Settings -> API).
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role key (found in the same API section). *Note: Keep this secret!*
   - `JWT_SECRET`: Any random long string (e.g., `my_super_secret_jwt_key_12345`).

### 3. Setting up Gmail SMTP (Optional)
If you want to send **real** OTP emails instead of using the simulated terminal link, you can easily use your Gmail account:
1. Go to your Google Account -> **Security**.
2. Ensure **2-Step Verification** is turned ON.
3. Search for **App Passwords** in the search bar.
4. Create a new App Password (name it "PadosiPro"). Google will give you a 16-character code.
5. In your `.env` file, set the following:
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=465`
   - `SMTP_USER=your.email@gmail.com`
   - `SMTP_PASS=the_16_character_app_password_without_spaces`
   - `FROM_EMAIL=your.email@gmail.com`

### 4. Install & Run
1. Open your terminal and go to the backend folder:
   ```bash
   cd backend
   ```
2. Install the necessary packages:
   ```bash
   npm install
   ```
3. Seed the database with our rich task categories:
   ```bash
   npm run seed
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server should now be running on `http://localhost:4000`.*

---

## 📱 Mobile App Setup (Expo React Native)

The mobile app is a cross-platform React Native app built using Expo Router.

### 1. Configure the API URL
The app needs to know where your backend is running.
1. Open `mobile/src/api/config.ts`.
2. By default, it connects to `10.0.2.2:4000` (which is how Android emulators talk to your computer) or `localhost:4000`. If you are testing on a **physical phone**, change the return value to your computer's local Wi-Fi IP address (e.g., `http://192.168.1.5:4000/api`).

### 2. Install & Run
1. Open a *new* terminal tab and go to the mobile folder:
   ```bash
   cd mobile
   ```
2. Install the necessary packages:
   ```bash
   npm install
   ```
3. Start the Expo server:
   ```bash
   npx expo start
   ```
4. **To view the app:**
   - **Android Emulator**: Press `a` in the terminal.
   - **iOS Simulator**: Press `i` in the terminal (Mac only).
   - **Physical Device**: Scan the QR code shown in the terminal using the Expo Go app.

---

## 🧪 Testing the Logic

We wrote unit tests for the most critical backend logic (OTP cooldowns, attempt limits, and expiry).
To run the tests, open a terminal in the `backend/` folder and run:
```bash
npm run test
```

---

## 📦 How to Build the APK (Android)

When you are ready to create a standalone `.apk` file that you can install on any Android phone (without needing Expo Go):

1. **Install EAS CLI**: 
   ```bash
   npm install -g eas-cli
   ```
2. **Login to Expo**:
   ```bash
   eas login
   ```
3. **Configure the Project**: 
   Inside the `mobile/` directory, run:
   ```bash
   eas build:configure
   ```
4. **Build the APK**:
   We will build a "Preview" profile so it outputs an APK instead of an App Bundle (AAB). Run:
   ```bash
   eas build -p android --profile preview
   ```
5. Wait for the build to finish on Expo's servers. Once done, the terminal will provide a link to download your `.apk` file!
