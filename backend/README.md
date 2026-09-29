# PadosiPro Backend API (Part A)

This backend serves the PadosiPro mobile application, fully implementing the requirements outlined in the technical assignment.

## Tech Stack
- **Language**: TypeScript (Node.js)
- **Framework**: Express.js
- **Database**: PostgreSQL (hosted on Supabase)
- **Validation**: Zod (for strict schema validation)
- **Email Delivery**: Nodemailer via SMTP (with Ethereal Email fallback)

## Running Locally

Because the backend relies on a managed PostgreSQL database (Supabase), no Docker database container is required. You can start the backend API with a single command:

```bash
npm install
npm run dev
```

The server will start on `http://localhost:4000`.

## Architecture & Requirements Fulfilled

### 1. Authentication & Security
- **Registration**: Users register with an email and password.
- **Password Hashing**: Passwords are never stored in plain text. They are hashed using **bcryptjs** (see `src/utils/crypto.ts`) before being saved to the database.
- **Verified Login Only**: The `/api/auth/login` endpoint returns a JWT token (valid for 7 days) if the user is verified. If the user hasn't verified their email, they are sent back an `{ unverified: true }` response along with a newly triggered OTP.

### 2. Email OTP Flow
- **Generation & Storage**: OTPs are generated as cryptographically secure 6-digit numeric strings. Only the **SHA-256 hash** of the OTP is saved in the database (`otps` table).
- **Time Limit & Expiry**: OTPs are strictly valid for **10 minutes**.
- **Brute-Force Protection**: The verification endpoint allows at most **5 incorrect attempts** before permanently invalidating the code.
- **Single Use**: Once successfully verified, the OTP record is marked as `is_used: true` to prevent replay attacks.
- **Cooldown**: A user cannot request a new OTP if they requested one within the last **30 seconds**.
- **Email Delivery**: We use `nodemailer` configured with real SMTP credentials in `.env`. If SMTP credentials are not provided or fail, it gracefully falls back to generating a local **Ethereal Email** test account, logging the real email preview URL in the terminal.

### 3. User Profiles
- Validated via `profileSchema` (using Zod).
- **Name, Address**: Required fields.
- **Mobile Number**: Strictly validated using a Regex to ensure it matches Indian standard (e.g., `+91 9876543210` or `9876543210` - exactly 10 digits starting with 6-9).
- **Business Name**: We made this field **optional**. 
  - *Why?* Because PadosiPro is a Lifestyle Management service handling personal and household errands. Many users will be signing up for their personal residences and will not have a registered business name.

### 4. Task Catalogue & Selection
- The database is pre-seeded with **21 tasks across 4 categories** (e.g., Household, Maintenance, Deliveries, Errands) matching the exact model of app.padosipro.com.
- The `user_tasks` table efficiently maps many-to-many relationships to save and return tasks picked by a user (`/api/tasks/select` and `/api/tasks/my-tasks`).

### 5. Error Handling & Validation
- Every input (Registration, OTP verification, Profile update) is intercepted by our global `validateBody` middleware using Zod schemas.
- Invalid requests return HTTP `400 Bad Request` with clear, human-readable error messages specifying exactly which fields failed.
- The global `errorHandler` middleware ensures that server errors never crash the process and always return consistent JSON formats.

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
PORT=4000
NODE_ENV=development

# Postgres (Supabase)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Auth
JWT_SECRET=your_jwt_secret

# SMTP Email (Optional - will fallback to Ethereal if missing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@padosipro.com
```
