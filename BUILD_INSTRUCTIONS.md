# PeerPrep Build Instructions

Complete guide to set up PeerPrep from scratch for development or evaluation.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Clone Repository](#2-clone-repository)
3. [Supabase Setup](#3-supabase-setup)
4. [Database Setup](#4-database-setup)
5. [Deploy Edge Functions](#5-deploy-edge-functions)
6. [Configure Environment](#6-configure-environment)
7. [Install Dependencies](#7-install-dependencies)
8. [Run the App](#8-run-the-app)
9. [Testing with Multiple Users](#9-testing-with-multiple-users)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

Install the following before proceeding:

| Tool             | Version      | Installation                        |
| ---------------- | ------------ | ----------------------------------- |
| **Node.js**      | 18.x or 20.x | [nodejs.org](https://nodejs.org/)   |
| **npm**          | 9.x+         | Comes with Node.js                  |
| **Expo CLI**     | Latest       | `npm install -g expo-cli`           |
| **Supabase CLI** | Latest       | `npm install -g supabase`           |
| **Git**          | Any          | [git-scm.com](https://git-scm.com/) |

**For Mobile Testing:**

- **iOS:** Xcode with iOS Simulator (macOS only)
- **Android:** Android Studio with Emulator
- **Physical Device:** Expo Go app from App Store / Play Store

**Verify installations:**

```bash
node --version    # Should show v18.x or v20.x
npm --version     # Should show 9.x+
expo --version    # Should show SDK version
supabase --version
```

---

## 2. Clone Repository

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/PeerPrep.git
cd PeerPrep
```

---

## 3. Supabase Setup

### 3.1 Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name:** `peerprep` (or your preference)
   - **Database Password:** Generate a strong password (save this!)
   - **Region:** Choose closest to you
5. Click **"Create new project"**
6. Wait 2-3 minutes for provisioning

### 3.2 Get Your Credentials

After project creation, go to **Settings > API**:

| Credential           | Where to Find                            | Used For                      |
| -------------------- | ---------------------------------------- | ----------------------------- |
| **Project URL**      | `Settings > API > Project URL`           | Frontend connection           |
| **Anon Key**         | `Settings > API > anon public`           | Frontend auth                 |
| **Service Role Key** | `Settings > API > service_role`          | Edge Functions (keep secret!) |
| **Project Ref**      | URL: `https://[PROJECT_REF].supabase.co` | CLI commands                  |

**Save these somewhere secure!**

---

## 4. Database Setup

### 4.1 Run SQL Scripts

The database setup is split into separate SQL files in the `setup/` folder. Run them **in order**:

1. Go to **Supabase Dashboard > SQL Editor**
2. Click **"New Query"**
3. Copy and paste each file, then click **"Run"**

| Order | File                            | Purpose                 |
| ----- | ------------------------------- | ----------------------- |
| 1     | `setup/01_schema.sql`           | Create all tables       |
| 2     | `setup/02_rls_policies.sql`     | Security policies       |
| 3     | `setup/03_triggers.sql`         | Auto profile creation   |
| 4     | `setup/04_seed_topics.sql`      | Insert practice topics  |
| 5     | `setup/05_session_messages.sql` | Chat table              |
| 6     | `setup/06_realtime_columns.sql` | Code/notes sync columns |

### 4.2 Enable Realtime

After running all SQL scripts:

1. Go to **Supabase Dashboard > Database > Replication**
2. Find these tables and **toggle ON** realtime:
   - `sessions`
   - `session_messages`
   - `matchmaking_queue`

### 4.3 Verify Setup

Run this query in SQL Editor to verify:

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Should show:
-- ai_feedback, matchmaking_queue, practice_questions, profiles,
-- scheduled_sessions, session_feedback, session_messages, sessions,
-- topics, user_stats

-- Check topics were seeded
SELECT id, name, icon FROM topics ORDER BY id;
-- Should show 6 topics
```

---

## 5. Deploy Edge Functions

### 5.1 Login to Supabase CLI

```bash
supabase login
# This opens a browser - authorize the CLI
```

### 5.2 Link Your Project

```bash
cd PeerPrep/PeerPrep  # Navigate to the app folder

supabase link --project-ref YOUR_PROJECT_REF
# Replace YOUR_PROJECT_REF with your actual project ref
# (found in URL: https://[PROJECT_REF].supabase.co)
```

### 5.3 Deploy Matchmaking Function

```bash
supabase functions deploy matchmaking
```

Expected output:

```
Bundling matchmaking
Deploying function matchmaking
```

### 5.4 Verify Deployment

1. Go to **Supabase Dashboard > Edge Functions**
2. You should see `matchmaking` listed
3. Status should be **"Active"**

---

## 6. Configure Environment

### 6.1 Create Environment File

Create a `.env` file in `PeerPrep/PeerPrep/`:

```bash
cd PeerPrep/PeerPrep
touch .env
```

### 6.2 Add Environment Variables

Edit `.env` with your credentials:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Service Role Key (for Edge Functions - DO NOT commit this!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**⚠️ IMPORTANT:** Never commit `.env` to version control!

The `.gitignore` should already include `.env`, but verify:

```bash
grep ".env" .gitignore
# Should show: .env or .env*
```

---

## 7. Install Dependencies

```bash
cd PeerPrep/PeerPrep
npm install
```

This installs:

- React Native / Expo dependencies
- Supabase client
- UI components (React Native Paper)
- State management (Zustand)
- And all other dependencies

Expected time: 2-5 minutes depending on network.

---

## 8. Run the App

### Option A: iOS Simulator (macOS only)

```bash
npm start
# Press 'i' when Expo menu appears
```

Or directly:

```bash
npx expo start --ios
```

### Option B: Android Emulator

1. Start Android Studio
2. Open **AVD Manager** and start an emulator
3. Run:

```bash
npm start
# Press 'a' when Expo menu appears
```

Or directly:

```bash
npx expo start --android
```

### Option C: Physical Device (Expo Go)

1. Install **Expo Go** from App Store / Play Store
2. Run:

```bash
npm start
```

3. Scan the QR code with:
   - **iOS:** Camera app
   - **Android:** Expo Go app

### Option D: Web Browser (Limited)

```bash
npx expo start --web
```

Note: Some features may not work fully in web mode.

---

## 9. Testing with Multiple Users

To test matchmaking and sessions, you need **two users**:

### 9.1 Create Test Accounts

1. Open the app on **two devices/simulators**
2. On each, tap **"Sign Up"**
3. Create accounts with different emails:
   - Device 1: `testuser1@test.com`
   - Device 2: `testuser2@test.com`

### 9.2 Test Matchmaking

1. **Device 1:** Select a topic → Join Queue
2. **Device 2:** Select the **same topic** → Join Queue
3. Both should be matched and enter a session together

### 9.3 Test Session Features

- **Timer:** Should count down from 25:00
- **Question:** Should display the practice problem
- **Code Tab:** Type code - should sync (if realtime enabled)
- **Notes Tab:** Type notes - should sync
- **Chat Tab:** Send messages - should appear on both devices
- **End Session:** Either user can end → goes to feedback

### 9.4 Test Feedback

1. End the session
2. Rate your partner (1-5 stars for clarity, correctness, confidence)
3. Submit feedback
4. Check Dashboard for updated stats

---

## 10. Troubleshooting

### Common Issues

#### "Network request failed"

- Check Supabase URL in `.env` is correct
- Ensure you're connected to internet
- Try restarting Expo

#### "Invalid API key"

- Verify `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env`
- Make sure you're using the **anon** key, not service_role

#### "Permission denied" on database

- Run `02_rls_policies.sql` in Supabase SQL Editor
- Check if user is authenticated before making requests

#### Edge Function not working

- Verify function is deployed: `supabase functions list`
- Check logs: `supabase functions logs matchmaking`
- Re-deploy: `supabase functions deploy matchmaking`

#### Realtime not syncing

- Verify tables have realtime enabled in Dashboard
- Check browser console for WebSocket errors
- Restart the app

#### "Module not found"

```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

#### iOS Simulator network issues

The app includes retry logic, but if persistent:

```bash
# Reset iOS Simulator
# Device > Erase All Content and Settings
```

#### Metro bundler stuck

```bash
# Kill and restart
npx expo start --clear
```

---

## Quick Reference

### Project Structure

```
PeerPrep/
├── PeerPrep/           # React Native app
│   ├── app/            # Screens (Expo Router)
│   ├── lib/            # API, hooks, types
│   ├── stores/         # Zustand state
│   └── supabase/       # Edge Functions
├── setup/              # SQL setup scripts
│   ├── 01_schema.sql
│   ├── 02_rls_policies.sql
│   ├── 03_triggers.sql
│   ├── 04_seed_topics.sql
│   ├── 05_session_messages.sql
│   └── 06_realtime_columns.sql
└── BUILD_INSTRUCTIONS.md  # This file
```

### Useful Commands

```bash
# Start development
npm start

# Clear cache
npx expo start --clear

# Deploy Edge Function
supabase functions deploy matchmaking

# View Edge Function logs
supabase functions logs matchmaking --tail

# Check Supabase status
supabase status
```

### Environment Variables Summary

| Variable                        | Description                     |
| ------------------------------- | ------------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`      | Your Supabase project URL       |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key for client |
| `SUPABASE_SERVICE_ROLE_KEY`     | Secret key for Edge Functions   |

---

## Need Help?

- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Expo Docs:** [docs.expo.dev](https://docs.expo.dev)
- **React Native:** [reactnative.dev](https://reactnative.dev)

---

**Happy Building! 🚀**
