export interface Notification {
  id: string;                // UUID from Supabase Auth
  userID: string;            // UUID of the user
  message: string;
  sentAt: Date;              // ISO date string
}