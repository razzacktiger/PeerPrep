//For AI; Question Bank that holds all questions for various topics 
export interface Question {
  id: string;                // UUID from Supabase Auth
  topicId: string;           // UUID of the topic
  questionText: string;
  difficulty: 'easy' | 'medium' | 'hard';
}