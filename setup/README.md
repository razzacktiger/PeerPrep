# PeerPrep Setup Directory

This folder contains all SQL scripts and configuration needed to set up PeerPrep from scratch.

## Files

| File | Purpose |
|------|---------|
| `01_schema.sql` | Core database tables and indexes |
| `02_rls_policies.sql` | Row-Level Security policies |
| `03_triggers.sql` | Database triggers (auto profile creation) |
| `04_seed_topics.sql` | Initial topic data |
| `05_session_messages.sql` | Real-time chat table |
| `06_realtime_columns.sql` | Additional columns for real-time sync |

## Execution Order

Run these scripts **in order** in the Supabase SQL Editor:

```
1. 01_schema.sql
2. 02_rls_policies.sql
3. 03_triggers.sql
4. 04_seed_topics.sql
5. 05_session_messages.sql
6. 06_realtime_columns.sql
```

See `../BUILD_INSTRUCTIONS.md` for complete setup guide.

