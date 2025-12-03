# PeerPrep
Peer Interview Prep Platform

# 📄 CMPE 277 Project Proposal

**Project Title:** **PeerPrep – Collaborative Interview & Study Practice App**
**Team Members:** Haroon Razzack 
**Course:** CMPE 277 – Mobile Device Development

---

## 1. Problem Statement

Preparing for technical interviews and exams can be lonely and inconsistent. Students often lack accountability, structured feedback, or peers to practice with. As a result, they either under-prepare or lose confidence. There is currently no lightweight, mobile-first tool that allows students to easily **pair up, practice, and get immediate feedback** on their performance.

---

## 2. Project Scope

PeerPrep is a **cross-platform mobile app** (Android + iOS) designed to connect learners for **real-time practice sessions**, generate **practice questions**, and provide **instant structured feedback**.

The scope of this project is to:

* Build a **fully functional MVP** that allows authenticated users to select a topic, join a practice queue, get paired with a peer, conduct a timed session, and leave feedback.
* Integrate a **low-cost AI solution** to generate new practice questions, summarize sessions, and provide rubric-style feedback.
* Track user streaks and progress over time, encouraging consistent practice habits.
* Deliver a visually polished and responsive app, with push notifications, real-time pairing, and cloud-synced data.

---

## 3. Target Audience

* **Primary:** University students preparing for coding interviews, quizzes, or technical exams.
* **Secondary:** Early-career developers and job seekers who want structured peer practice.

**Personas:**

* *“Riya, 23”* – A senior CS student who wants to practice behavioral and system design questions before internship interviews.
* *“Sam, 25”* – A bootcamp grad seeking mock interviews for confidence and accountability.

---

## 4. Key Features (Prioritized)

### **MVP (Must Have – Weeks 1–4)**

* 🔐 **Authentication & Profiles** (Supabase Auth)
* 📚 **Topic Selection & Instant Pairing** (Edge Function matchmaking)
* ⏱ **Session Room:** Timer + question display + optional recording toggle (audio/video)
* 💬 **Peer Feedback:** Quick rubric rating and notes
* 🤖 **AI Cross-Check:** AI reviews session transcript (if recording enabled) and provides a secondary rating + short summary to mitigate trolling or unfair peer ratings.
* 🔔 **Push Notifications:** Session ready, reminders
* 📊 **Dashboard:** Track completed sessions, streaks, and average feedback scores

### **Session Flow Example**

1. **Topic Selection:** User picks a topic (e.g., Data Structures) and joins queue.
2. **Instant Pairing:** Edge Function matches two users waiting for the same topic.
3. **Session Room:** Displays countdown timer, first question, and optional note-taking area. Users alternate answering questions or discussing solutions, optionally enabling voice/video call.
4. **Recording & AI Feedback (Optional):** If users consent, audio is recorded and transcribed for AI to generate a fairness score, predicted rubric, and brief explanation.
5. **Peer Feedback:** At session end, both participants rate each other with a rubric (clarity, correctness, confidence) and can leave notes.
6. **Dashboard Update:** Streaks, AI feedback, and scores update for both users.

### **Phase 2 (Nice to Have – Weeks 5–6)**

* 🤖 **AI Question Generation:** Use Groq/Gemini API to generate or vary questions on-demand
* 📝 **AI Rubric Feedback & Session Summary:** Actionable suggestions in <1s
* 🏆 **Leaderboard / Consistency Streaks:** Gamify practice

### **Stretch Goals (Weeks 7–8 if ahead of schedule)**

* 📅 **Scheduling:** Book a session in advance
* 🎥 **Video/Voice Integration:** Full-featured LiveKit or Google Meet integration with mute/unmute controls
* 📤 **Session Export:** Email or save notes, ratings, and AI summary for later review

---

## 5. Technology Stack & Architecture

### **Frontend (Mobile)**

* **React Native + Expo (TypeScript)** – cross-platform development
* **Expo Router** – navigation
* **Zustand** – lightweight state management
* **TanStack Query** – server cache & sync
* **React Native Paper** – Material Design components
* **Expo Notifications** – push notifications

### **Backend**

* **Supabase** – Postgres + Realtime + Auth + Storage
* **Edge Functions (Deno)** – pairing queue, session creation, leaderboard calculation
* **Row-Level Security** – ensure users can only access their data

### **AI Integration**

* **Groq (Llama 3.1 8B)** – primary (low-cost, fast inference \~\$0.001/session)
* **Gemini 2.5 Flash Lite** – backup (low-latency, cheap inference)
* **Whisper API or Open-Source Transcriber** – for optional audio transcription
* **Caching** – store generated questions to minimize token usage and costs

### **DevOps & QA**

* **GitHub + Conventional Commits** – version control & clean history
* **GitHub Actions + Expo EAS** – CI/CD and preview builds
* **Sentry** – crash reporting
* **PostHog** – basic usage analytics

---

## 6. System Architecture (High-Level)

```text
+----------------+           +---------------------+
|  React Native  | <-------> | Supabase REST / RT  |
|  (Expo Client) |           | + Edge Functions    |
+-------+--------+           +-----+---------------+
        |                          |
        |        AI Calls          |
        +------------------------->+ Groq/Gemini API (Q Generation, Scoring)
                                   + Whisper (Transcription)
```

* Frontend communicates with Supabase for auth, matchmaking, and data persistence.
* Supabase Edge Functions handle pairing logic and enforce security rules.
* AI API is called only when needed (question generation, feedback, transcript scoring), with results cached in the DB.

---

## 6.1 Recording & Transcription Architecture (Optional)

**Goal:** Provide fair, secondary AI scoring while keeping costs and privacy under control.

**Flow:**

1. **Consent & Toggle:** Users explicitly opt-in to recording inside the Session Room.
2. **Local Capture (Audio-Only for MVP):** Record WebM/Opus, hard-cap ≤15 minutes and show remaining time.
3. **Upload to Storage:** Client uploads directly to Supabase Storage (private bucket) using a signed URL.
4. **Transcription Job:** Edge Function/worker pulls file via signed URL → runs Whisper → saves transcript to Postgres.
5. **AI Fairness Check:** Pass transcript and rubric to Groq/Gemini → get predicted rubric scores, rationale, confidence.
6. **Persist Minimal Data:** Store only transcript + AI scores, auto-delete raw audio after 7–14 days.
7. **Access Control:** Private bucket with signed URLs, RLS on transcript rows.

**Cost & Privacy Notes:**

* Audio-only keeps files small (\~1–2 MB/min) and cost low.
* Add per-user quotas and daily AI credit caps.
* Display clear consent text and allow user-initiated deletion.

**If Video Later:** Use LiveKit for real-time A/V and S3/R2 for cloud recording output, storing only transcripts + scores in Supabase.

---

## 7. Project Timeline (10 Weeks)

| **Week** | **Milestones**                                                |
| -------- | ------------------------------------------------------------- |
| 1        | Wireframes, personas, DB schema design, Supabase setup        |
| 2        | Auth & topic selection screen, Edge Function stubs            |
| 3        | Session room UI + timer, pairing queue integration            |
| 4        | Peer + AI feedback integration, dashboard, push notifications |
| 5        | AI question generation & caching, transcription tuning        |
| 6        | Leaderboards, streak animations, polish & bug fixing          |
| 7        | Optional scheduling + export                                  |
| 8        | UI/UX refinements, testing, screenshots, final docs           |
| 9        | Demo prep, dry run with sample users                          |
| 10       | Final presentation & submission                               |

---

## 8. Team Roles (3 Developers)

| **Role**      | **Dev A**                                         | **Dev B**                                                | **Dev C**                                         |
| ------------- | ------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------- |
| **Focus**     | Mobile UI/UX                                      | Backend & Realtime                                       | AI + DevOps                                       |
| **Key Tasks** | Auth flow, session UI, dashboard, notifications   | Supabase schema, Edge Functions, pairing logic, security | AI prompts, transcription, CI/CD, cost monitoring |
| **Shared**    | Wireframing, testing, documentation, presentation |                                                          |                                                   |

---

## 9. Risks & Mitigation

| **Risk**                         | **Mitigation**                                                                |
| -------------------------------- | ----------------------------------------------------------------------------- |
| AI costs grow unexpectedly       | Use caching, free-tier credits, fallback to pre-written Q-bank                |
| Scheduling conflicts             | Keep sprints small, communicate weekly progress, async standups               |
| Scope creep                      | Freeze MVP after week 4, prioritize polish & stability before adding features |
| Privacy concerns with recordings | Make recording optional and encrypted, get user consent before starting       |

---

## 10. Expected Outcome

* **Deliverable:** Fully functional mobile app + source code repo + README/build instructions
* **Learning Outcomes:**

  * End-to-end mobile development with React Native & cloud backend
  * Secure, scalable real-time pairing logic
  * Practical AI integration with cost-awareness and fairness checks
  * Deployment, testing, and collaboration in a professional workflow

