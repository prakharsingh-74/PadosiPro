# PadosiPro - System Design Document

## 🏗️ Architecture Overview

The PadosiPro architecture follows a classic, decoupled Client-Server model. It consists of three main pillars:

1. **Frontend (Mobile App)**: Built with **React Native** and **Expo Router**. It focuses exclusively on presentation, UI interactions, and routing. It communicates with the backend via RESTful API calls.
2. **Backend (API Server)**: Built with **Node.js, Express, and TypeScript**. It acts as the business logic orchestrator. It handles HTTP requests, validates payloads, enforces security rules (like OTP limits), and communicates with the database.
3. **Database (Supabase / PostgreSQL)**: A relational database hosted on Supabase. It strictly holds the data schema and provides a robust Postgres engine for data integrity.

## ⚖️ Main Trade-offs

### 1. REST API + Express vs. Direct Supabase Client on Mobile
**Decision:** We built a dedicated Node.js backend instead of querying Supabase directly from the mobile app using `@supabase/supabase-js`.
**Trade-off:**
*   **Pros:** Better security abstraction. We can enforce complex logic (like OTP cooldowns, attempt limits, and custom email dispatching) seamlessly on the server without exposing database schemas or keys to the mobile client.
*   **Cons:** Increases infrastructure complexity. We now have to manage and host a Node.js server instead of just a database.

### 2. OTP in Database vs. In-Memory Cache (Redis)
**Decision:** OTPs and their attempt counts are stored directly in a Postgres `OTPs` table.
**Trade-off:**
*   **Pros:** Much simpler to set up and deploy since we only need one infrastructure piece (Supabase). It provides persistent tracking of verification histories.
*   **Cons:** Postgres is slower than an in-memory store like Redis for high-frequency writes. If the app scales to millions of concurrent logins, the `OTPs` table could become a bottleneck.

## 🚫 What Was Left Out

Given the time constraints, the following components were intentionally omitted:
1. **Global State Management:** We relied on local React state (`useState`) and route parameters instead of introducing heavy libraries like Redux or Zustand, keeping the app lightweight.
2. **Real SMS Integration:** OTPs are dispatched via email (`nodemailer`) instead of costly SMS APIs (like Twilio) to ensure free and easy testing during development.
3. **Comprehensive E2E Testing:** While critical business logic is unit-tested in the backend, end-to-end mobile tests (via Detox or Appium) were left out.
4. **Token Refresh Rotation:** The authentication system issues JWTs, but lacks a sophisticated refresh token rotation mechanism.

## 🚀 What can we do next in this project

If given another week to work on this, I would focus on:
1. **React Query Integration:** Introduce `@tanstack/react-query` on the mobile app to handle caching, background fetching, and loading states automatically for the Task Catalogue.
2. **Push Notifications:** Set up Expo Push Notifications so the backend can alert the user when their task status changes.
3. **Redis Caching:** Introduce a Redis layer on the backend to handle rate-limiting, OTP caching, and to cache the heavy JSON payload of the Task Catalogue.
4. **Offline Mode:** Use `AsyncStorage` or `WatermelonDB` to allow users to browse the Task Catalogue even when they drop network connectivity.
