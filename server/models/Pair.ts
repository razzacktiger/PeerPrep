//A Waiting room model representing a pair of users waiting to be matched for a tutoring session.
export interface Pair {
  id: string;                // UUID from Supabase Auth
  userIDOne: string;            // UUID of the first user
  userIDTwo: string;            // UUID of the second user
  topicID: string;
}