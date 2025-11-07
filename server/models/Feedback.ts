export interface Feedback {
  id: string;                // UUID from Supabase Auth
  sessionId: string;         // UUID of the session
  userIDOne: string;            // UUID of the tester
  userIDTwo: string;            // UUID of the peer
  clarity: number;          // Clarity rating out of 5
  correctness: number;     // Correctness rating out of 5
  rating: number;            // Rating out of 5
  aiScore?: number;         // AI-generated score out of 100
  comments?: string;         // Optional comments
}