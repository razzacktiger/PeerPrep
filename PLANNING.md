# PeerPrep - Project Planning & Architecture

## 🎯 Project Overview

PeerPrep is a collaborative interview prep platform built with React Native (Expo) + Supabase + AI integration.

**Core Value Proposition:** Connect learners for real-time practice sessions with AI-powered feedback and structured peer evaluation.

## 📋 Architecture & Technology Stack

### Frontend (Mobile)

- **React Native + Expo (TypeScript)** - cross-platform development
- **Expo Router** - navigation
- **Zustand** - lightweight state management
- **TanStack Query** - server cache & sync
- **React Native Paper** - Material Design components
- **Expo Notifications** - push notifications

### Backend

- **Supabase** - Postgres + Realtime + Auth + Storage
- **Edge Functions (Deno)** - pairing queue, session creation, leaderboard calculation
- **Row-Level Security** - ensure users can only access their data

### AI Integration

- **Groq (Llama 3.1 8B)** - primary (low-cost, fast inference ~$0.001/session)
- **Gemini 2.5 Flash Lite** - backup (low-latency, cheap inference)
- **Whisper API** - for optional audio transcription
- **Caching** - store generated questions to minimize token usage and costs

## 🏗️ System Architecture

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

## 📊 Database Schema Design

### Core Tables

1. **profiles** - User profiles and preferences
2. **topics** - Practice topics (Data Structures, System Design, etc.)
3. **sessions** - Practice sessions between users
4. **session_feedback** - Peer ratings and notes
5. **ai_feedback** - AI-generated feedback and scores
6. **session_recordings** - Optional audio/transcript storage
7. **practice_questions** - AI-generated or curated questions
8. **user_stats** - Streaks, scores, progress tracking

## 🎛️ Key Features & User Flow

### MVP Session Flow

1. **Topic Selection** → User picks topic (e.g., Data Structures) and joins queue
2. **Instant Pairing** → Edge Function matches two users for same topic
3. **Session Room** → Timer, question display, optional recording toggle
4. **Peer Feedback** → Rubric rating (clarity, correctness, confidence) + notes
5. **AI Cross-Check** → AI reviews transcript and provides secondary rating
6. **Dashboard Update** → Streaks, scores, and feedback update

### Security & Privacy

- Row-Level Security (RLS) on all tables
- Private bucket for audio recordings with signed URLs
- Auto-delete raw audio after 7-14 days
- Explicit user consent for recording features

## 🔄 Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Individual features
- `hotfix/*` - Critical fixes

### Commit Standards

- Use Conventional Commits
- Test before committing
- Small, focused commits
- Descriptive commit messages

### Code Standards

- TypeScript throughout
- ESLint + Prettier
- Follow React Native best practices
- Document non-obvious code with comments
- Functions should have docstrings

## 📁 Project Structure

```
PeerPrep/
├── README.md
├── PLANNING.md
├── TASK.md
├── context/               # Additional project documentation
├── app/                   # Expo Router app directory
├── components/            # Reusable UI components
├── lib/                   # Utilities, constants, types
├── hooks/                 # Custom React hooks
├── services/              # API calls, Supabase client
├── stores/                # Zustand stores
├── tests/                 # Unit tests
└── supabase/              # Database migrations, Edge Functions
    ├── migrations/
    ├── functions/
    └── seed.sql
```

## ⚡ Performance & Cost Optimization

- Cache AI-generated questions
- Use AI judiciously (only for feedback, not every session)
- Monitor token usage and set daily limits
- Optimize database queries with indexes
- Use Supabase realtime selectively

## 🛡️ Risk Mitigation

- **AI Costs**: Caching, free-tier credits, fallback to pre-written questions
- **Scope Creep**: Freeze MVP after Week 4, focus on polish
- **Team Coordination**: Weekly standups, clear task assignments
- **Privacy Concerns**: Optional recording, explicit consent, secure storage

## 📈 Success Metrics

- User engagement (sessions per week)
- Feedback quality scores
- Streak consistency
- AI cost per session
- User retention after first session
