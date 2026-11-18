// Shared types — mirror the website's contracts (see API.md).
// The website is the source of truth; if a field changes there, change
// it here too.

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Index of the correct option. */
  answer: number;
}

export interface Lesson {
  id: string;
  title: string;
  moduleTitle: string;
  courseTitle: string;
  durationSeconds: number;
  videoUrl: string;
  videoSource: "mega" | "drive";
  notes: string;
  quiz?: QuizQuestion[];
}

export interface SessionUser {
  email: string;
  name: string;
  picture: string | null;
  auth: "google" | "email";
  mfa: boolean;
}

export interface AiChatMessage {
  role: "user" | "assistant";
  text: string;
  /** "mm:ss" citations the tutor returns, when present. */
  citations?: string[];
  grounded?: boolean;
}

export interface AiTutorResponse {
  answer: string;
  grounded?: boolean;
  citations?: string[];
  error?: string;
}
