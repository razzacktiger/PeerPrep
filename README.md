# 🎯 PeerPrep

> **Collaborative Interview & Study Practice App**  
> A cross-platform mobile application connecting learners for real-time technical interview practice with AI-powered feedback.

[![React Native](https://img.shields.io/badge/React_Native-Expo-blue?logo=react)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-99.4%25-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-View-lightgrey)](./LICENSE)

---

## 📋 Table of Contents

- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [Course Information](#course-information)
- [License](#license)

---

<a id="problem-statement"></a>

## 🎯 Problem Statement

Preparing for technical interviews and exams can be **lonely and inconsistent**. Students often lack:

- 👥 Accountability partners
- 📝 Structured feedback
- 🤝 Peers to practice with

As a result, they either under-prepare or lose confidence. There is currently no lightweight, mobile-first tool that allows students to easily **pair up, practice, and get immediate feedback** on their performance.

---

<a id="solution"></a>

## 💡 Solution

**PeerPrep** is a cross-platform mobile app (Android + iOS) designed to:

1. **Connect learners** for real-time practice sessions
2. **Generate practice questions** using AI
3. **Provide instant structured feedback** through peer ratings and AI analysis
4. **Track progress** with streaks, scores, and session history

---

<a id="key-features"></a>

## ✨ Key Features

| Feature                                  | Description                                                      |
| ---------------------------------------- | ---------------------------------------------------------------- |
| 🔐 **Authentication**                    | Secure sign-up/login via Supabase Auth                           |
| 📚 **Topic Selection**                   | Choose from Data Structures, Algorithms, System Design, and more |
| ⚡ **Instant Matching**                  | Real-time peer pairing via Edge Functions                        |
| ⏱️ **Session Room**                      | Timed practice with shared code editor and notes                 |
| 💬 **Real-time Chat**                    | In-session messaging with peers                                  |
| 🤖 **AI Feedback (Future WIP)**          | AI-generated question generation and feedback                    |
| ⭐ **Peer Reviews**                      | Rate partners on clarity, correctness, and confidence            |
| 📊 **Progress Dashboard**                | Track sessions, streaks, and average scores                      |
| 🔔 **Push Notifications (Release Soon)** | Session reminders and match alerts                               |

---

<a id="tech-stack"></a>

## 🛠️ Tech Stack

### Frontend

- **React Native + Expo** — Cross-platform mobile development
- **Expo Router** — File-based navigation
- **TypeScript** — Type safety throughout
- **Zustand** — Lightweight state management
- **React Native Paper** — Material Design components

### Backend

- **Supabase** — PostgreSQL + Realtime + Auth + Storage
- **Edge Functions (Deno)** — Serverless matchmaking logic
- **Row-Level Security** — Fine-grained data access control

### AI Integration (Future Work in Progress)

- **Groq / Gemini API** — Question generation and feedback
- **Whisper** — Audio transcription (optional)

---

<a id="quick-start"></a>

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or 20.x
- npm 9.x+
- Expo CLI
- Supabase account

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/razzacktiger/PeerPrep.git
cd PeerPrep/PeerPrep

# Install dependencies
npm install

# Set up environment variables (see BUILD_INSTRUCTIONS.md)
cp .env.example .env

# Start development server
npm start
```

> 📖 **For complete setup instructions including Supabase configuration**, see **[BUILD_INSTRUCTIONS.md](./BUILD_INSTRUCTIONS.md)**

---

<a id="documentation"></a>

## 📚 Documentation

| Document                                                                                    | Description                                        |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 📘 [**BUILD_INSTRUCTIONS.md**](./BUILD_INSTRUCTIONS.md)                                     | Complete setup guide for developers and evaluators |
| 📁 [**setup/**](./setup/)                                                                   | SQL scripts for Supabase database setup            |
| 📋 [**PROJECT_OBJECTIVES.md**](./PROJECT_OBJECTIVES.md)                                     | Original project proposal and objectives           |
| 🎨 [**Platform-Specific Design Standards.md**](./Platform-Specific%20Design%20Standards.md) | iOS & Android design guidelines                    |
| 🔬 [**UX Research - PeerPrep.md**](./UX%20Research%20-%20PeerPrep.md)                       | User personas and journey maps                     |
| 📝 [**PLANNING.md**](./PLANNING.md)                                                         | Architecture and technical planning                |
| ➡️ [**NEXT_STEPS.md**](./NEXT_STEPS.md)                                                     | Future development roadmap                         |

### Setup Files Reference

The `setup/` folder contains SQL scripts to configure your own Supabase backend:

```
setup/
├── README.md                   # Setup folder guide
├── 01_schema.sql              # Database tables & enums
├── 02_rls_policies.sql        # Row-Level Security policies
├── 03_triggers.sql            # Auto profile creation trigger
├── 04_seed_topics.sql         # Initial practice topics
├── 05_session_messages.sql    # Chat functionality
└── 06_realtime_columns.sql    # Real-time collaboration columns
```

---

<a id="project-structure"></a>

## 📁 Project Structure

```
PeerPrep/
├── PeerPrep/                  # React Native Expo App
│   ├── app/                   # Expo Router screens
│   │   ├── (app)/            # Authenticated routes
│   │   ├── (auth)/           # Login/signup screens
│   │   └── _layout.tsx       # Root layout
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Core libraries
│   │   ├── api/              # API functions
│   │   ├── hooks/            # Custom React hooks
│   │   └── supabase.ts       # Supabase client config
│   ├── stores/               # Zustand state stores
│   └── supabase/functions/   # Edge Functions
│       └── matchmaking/      # Peer matching logic
├── setup/                    # SQL setup scripts
├── BUILD_INSTRUCTIONS.md     # Developer setup guide
├── PROJECT_OBJECTIVES.md     # Project proposal
└── README.md                 # This file
```

---

<a id="contributors"></a>

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/razzacktiger">
        <img src="https://github.com/razzacktiger.png" width="100px;" alt="Haroon Razzack"/><br />
        <sub><b>Haroon Razzack</b></sub>
      </a><br />
      <sub>Project Lead</sub>
    </td>
  </tr>
</table>

> See all contributors on [GitHub Contributors Page](https://github.com/razzacktiger/PeerPrep/graphs/contributors)

---

<a id="course-information"></a>

## 🎓 Course Information

|                  |                                      |
| ---------------- | ------------------------------------ |
| **Course**       | CMPE 277 — Mobile Device Development |
| **University**   | San José State University            |
| **Semester**     | Fall 2025                            |
| **Project Type** | Team Project                         |

---

<a id="license"></a>

## 📄 License

This project is licensed under the terms specified in the [LICENSE](./LICENSE) file.

---

<div align="center">

**Built with ❤️ for CMPE 277**

[⬆ Back to Top](#-peerprep)

</div>
