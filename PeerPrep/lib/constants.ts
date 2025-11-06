/**
 * Application Constants
 */

// Mock Topics
export const TOPICS = [
  {
    id: '1',
    name: 'Data Structures',
    description: 'Arrays, Linked Lists, Trees, Graphs',
    icon: '📊',
    difficulty_levels: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: '2',
    name: 'Algorithms',
    description: 'Sorting, Searching, Dynamic Programming',
    icon: '🧮',
    difficulty_levels: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: '3',
    name: 'System Design',
    description: 'Scalability, Architecture, Distributed Systems',
    icon: '🏗️',
    difficulty_levels: ['Medium', 'Hard'],
  },
  {
    id: '4',
    name: 'Behavioral',
    description: 'STAR method, Leadership, Conflict Resolution',
    icon: '💬',
    difficulty_levels: ['Easy', 'Medium'],
  },
  {
    id: '5',
    name: 'Object-Oriented Design',
    description: 'Classes, Inheritance, Design Patterns',
    icon: '🎨',
    difficulty_levels: ['Medium', 'Hard'],
  },
  {
    id: '6',
    name: 'Database Design',
    description: 'SQL, NoSQL, Normalization, Indexing',
    icon: '🗄️',
    difficulty_levels: ['Easy', 'Medium', 'Hard'],
  },
];

// Session Duration
export const DEFAULT_SESSION_DURATION = 25; // minutes

// Rating Scale
export const RATING_MIN = 1;
export const RATING_MAX = 5;

// Colors
export const COLORS = {
  primary: '#6200ee',
  secondary: '#03dac6',
  error: '#b00020',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#000000',
  disabled: '#a0a0a0',
};

// Mock Questions by Topic
export const MOCK_QUESTIONS = {
  '1': [
    {
      id: 'q1',
      title: 'Two Sum',
      prompt: 'Given an array of integers, return indices of the two numbers that add up to a specific target.',
      difficulty: 'Easy' as const,
      topic: 'Data Structures',
      hints: ['Use a hash map', 'Store seen values as you iterate'],
    },
    {
      id: 'q2',
      title: 'Valid Binary Search Tree',
      prompt: 'Determine if a binary tree is a valid binary search tree.',
      difficulty: 'Medium' as const,
      topic: 'Data Structures',
      hints: ['Use in-order traversal', 'Check if result is sorted'],
    },
  ],
  '2': [
    {
      id: 'q3',
      title: 'Merge Sort',
      prompt: 'Implement merge sort algorithm to sort an array.',
      difficulty: 'Medium' as const,
      topic: 'Algorithms',
      hints: ['Divide and conquer', 'Merge two sorted arrays'],
    },
  ],
  '3': [
    {
      id: 'q4',
      title: 'Design a URL Shortener',
      prompt: 'Design a system like bit.ly that shortens URLs.',
      difficulty: 'Medium' as const,
      topic: 'System Design',
      hints: ['Consider hash functions', 'Database design', 'Scalability'],
    },
  ],
  '4': [
    {
      id: 'q5',
      title: 'Tell me about a time you faced conflict',
      prompt: 'Describe a situation where you had a disagreement with a team member and how you resolved it.',
      difficulty: 'Medium' as const,
      topic: 'Behavioral',
      hints: ['Use STAR method', 'Focus on resolution', 'Show empathy'],
    },
  ],
  '5': [
    {
      id: 'q6',
      title: 'Design a Parking Lot',
      prompt: 'Design a parking lot system with different vehicle types and parking spots.',
      difficulty: 'Medium' as const,
      topic: 'Object-Oriented Design',
      hints: ['Consider inheritance', 'Use abstract classes', 'Define interfaces'],
    },
  ],
  '6': [
    {
      id: 'q7',
      title: 'Database Schema for E-commerce',
      prompt: 'Design a database schema for an e-commerce platform with products, orders, and users.',
      difficulty: 'Medium' as const,
      topic: 'Database Design',
      hints: ['Normalize tables', 'Consider relationships', 'Add indexes'],
    },
  ],
};


