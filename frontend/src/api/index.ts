const API_BASE = '/api'; // Proxied through Vite to http://localhost:3000

// --- Types ---

export interface MessageResponse {
  message: string;
}

export interface User {
  id: number;
  username: string;
  createdAt: number | null;
}

export interface Quiz {
  id: number;
  quizName: string;
  genre: string | null;
  description: string | null;
  difficulty: string | null;
  timeLimit: number | null;
  createdAt: number | null;
  updatedAt: number | null;
}

export interface PaginatedQuizzes {
  data: Quiz[];
  total: number;
  totalPages: number;
}

export interface Letter {
  id: number;
  letter: string;
}

export interface Question {
  id: number;
  question: string;
  hint: string | null;
  quizId: number;
  letterId: number;
}

export interface ValidateAnswerResponse {
  isCorrect: boolean;
}

// --- Users ---

export async function getUserById(id: number): Promise<User> {
  const response = await fetch(`${API_BASE}/users/${id}`);
  if (!response.ok) throw new Error('Failed to get user');
  return response.json();
}

// --- Quizzes ---

export async function getQuizzes(params?: { page?: number; rowsPerPage?: number }): Promise<PaginatedQuizzes> {
  const query = new URLSearchParams();
  if (params?.page != null) query.set('page', String(params.page));
  if (params?.rowsPerPage != null) query.set('rowsPerPage', String(params.rowsPerPage));
  const url = query.toString() ? `${API_BASE}/quizzes?${query}` : `${API_BASE}/quizzes`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to get quizzes');
  return response.json();
}

// --- Letters ---

export async function getLetters(): Promise<Letter[]> {
  const response = await fetch(`${API_BASE}/letters`);
  if (!response.ok) throw new Error('Failed to get letters');
  return response.json();
}

// --- Questions ---

export interface QuizQuestion {
  question: string;
  hint: string | null;
}

export async function getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
  const response = await fetch(`${API_BASE}/quizzes/${quizId}/questions`);
  if (!response.ok) throw new Error('Failed to get quiz questions');
  return response.json();
}

export async function getQuestion(quizId: number, letterId: number): Promise<Question> {
  const response = await fetch(`${API_BASE}/questions?quizId=${quizId}&letterId=${letterId}`);
  if (!response.ok) throw new Error('Failed to get question');
  return response.json();
}

// --- Answers ---

export async function validateAnswer(questionId: number, answer: string): Promise<ValidateAnswerResponse> {
  const params = new URLSearchParams({ questionId: String(questionId), answer });
  const response = await fetch(`${API_BASE}/answers/validate?${params}`);
  if (!response.ok) throw new Error('Failed to validate answer');
  return response.json();
}

// --- Game Sessions ---

export async function createGameSession(params: {
  userId: number;
  quizId: number;
  currentQuestionId?: number;
  score?: number;
}): Promise<MessageResponse> {
  const response = await fetch(`${API_BASE}/game-sessions/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!response.ok) throw new Error('Failed to create game session');
  return response.json();
}

// --- Game Session Questions ---

export async function createGameSessionQuestion(
  questionId: number,
  gameSessionId: number,
  isAnswered: boolean,
): Promise<MessageResponse> {
  const response = await fetch(`${API_BASE}/game-sessions-questions/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId, gameSessionId, isAnswered }),
  });
  if (!response.ok) throw new Error('Failed to add question to game session');
  return response.json();
}

export async function updateGameSessionQuestion(
  gameSessionQuestionId: number,
  isAnswered: boolean,
): Promise<MessageResponse> {
  const response = await fetch(`${API_BASE}/game-sessions-questions/update`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameSessionQuestionId, isAnswered }),
  });
  if (!response.ok) throw new Error('Failed to update game session question');
  return response.json();
}
