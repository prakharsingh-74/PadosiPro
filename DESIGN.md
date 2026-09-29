# DESIGN.md — Architecture & Engineering Trade-Offs

## 🏛️ System Architecture

The PadosiPro system is designed around a decoupled monorepo architecture:
- **Client Layer**: Native React Native mobile app using Expo Router for stack-based screen transitions and persistent local token management (`AsyncStorage`).
- **API Gateway / Server Layer**: Express.js REST API providing strict Zod schema validation, JWT auth middleware, centralized error handling, and rate-limiting rules.
- **Security & Data Layer**: Supabase PostgreSQL DB with SHA-256 OTP hashing (raw OTP codes are never stored in the database), bcrypt password hashing, and cascading foreign keys.
- **Local Mail Catcher**: Mailpit SMTP server containerized via Docker Compose.

---

## 🔒 Security & Risky Logic Implementation

1. **OTP Hashing & Expiry**:
   - OTP codes are 6-digit cryptographically generated numeric strings.
   - Only the `SHA-256` hash of the OTP is stored in the database to prevent plain-text exposure in database dumps.
   - OTP records enforce a 10-minute expiry window (`expires_at < NOW()`).
   - A strict limit of **at most 5 wrong attempts** is tracked per OTP record. Upon exceeding 5 attempts, the OTP is invalidated (`is_used = true`).
   - Resend requests enforce a **30-second cooldown** (`last_sent_at < 30s`) to prevent spamming.

2. **Indian Mobile Number Validation**:
   - Evaluated on both client and server via strict regex (`/^(?:\+91)?[6-9]\d{9}$/`).

3. **Optional Business Name Trade-off**:
   - **Decision**: Made `Business Name` optional during first-login profile setup.
   - **Rationale**: PadosiPro caters primarily to individual households who do not own a registered business. For home offices or small businesses, providing a business name helps personalize service delivery without creating an unnecessary barrier for residential households.

---

## ⚖️ Main Engineering Trade-offs

1. **Supabase Client vs. ORM (Prisma/Drizzle)**:
   - *Trade-off*: Used `@supabase/supabase-js` with service role privileges over a full ORM like Prisma.
   - *Benefit*: Faster server startup times, lower container image footprint, and direct integration with Supabase features while retaining raw SQL schema migrations (`migrations/001_initial_schema.sql`).

2. **Mailpit SMTP vs. Production Email Provider (Resend/SendGrid)**:
   - *Trade-off*: Integrated Mailpit into Docker Compose for local development rather than requiring real API keys.
   - *Benefit*: Ensures reviewers can run `docker-compose up` offline without external API rate limits or invalid credential errors.

---

## 🚀 What Was Left Out & Next Week Roadmap

If given another week, the next enhancements would include:
1. **Push Notifications**: Expo Notifications integration to alert users when a Lifestyle Manager accepts or updates a selected task.
2. **Real-time Chat with Lifestyle Manager**: Supabase Realtime WebSocket subscription allowing direct in-app messaging between the user and their assigned manager.
3. **Task Progress Tracker**: Stepper timeline (`Requested` ➔ `Manager Assigned` ➔ `In Progress` ➔ `Completed`).
4. **Offline Sync & Cache**: React Query integration with persistent offline caching for seamless task browsing when internet connectivity drops.
