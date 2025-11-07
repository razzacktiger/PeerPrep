/**
 * Session model representing a tutoring session between two users.
 */
export interface Session {
  id: string;                // UUID from Supabase Auth
  topicID: string;
  userIDOne: string;            // UUID of the user
  userIDTwo: string;            // UUID of the teacher
  token: string;             // Session token
  startTime: Date;         // ISO date string
  endTime: Date;         // ISO date string
  recordingURL?: string;   // Optional URL for session recording
  feedback?: string;        // Optional feedback from the user
  status: 'scheduled' | 'completed' | 'canceled'; // Session status
}