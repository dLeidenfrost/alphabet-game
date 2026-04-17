import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/* Table definition */
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const quizzes = sqliteTable('quizzes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  quizName: text('quiz_name').notNull().unique(),
  genre: text('genre'),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const letters = sqliteTable('letters', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  letter: text('letter').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const questions = sqliteTable('questions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  question: text('question').notNull(),
  hint: text('hint'),
  quizId: integer('quiz_id').notNull().references(() => quizzes.id),
  letterId: integer('letter_id').notNull().references(() => letters.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const answers = sqliteTable('answers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  answer: text('answer').notNull(),
  questionId: integer('question_id').notNull().unique().references(() => questions.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const gameSessions = sqliteTable('game_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  quizId: integer('quiz_id').notNull().references(() => quizzes.id),
  currentQuestionId: integer('current_question_id').references(() => questions.id),
  score: integer('score').default(0),
  startedAt: integer('started_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
});

export const gameSessionQuestions = sqliteTable('game_session_questions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  gameSessionId: integer('game_session_id').notNull().references(() => gameSessions.id),
  questionId: integer('question_id').notNull().references(() => questions.id),
  isAnswered: integer('is_answered', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

/* Relationships */
export const lettersRelations = relations(letters, ({ many }) => ({
  questions: many(questions),
}));

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(questions),
  gameSessions: many(gameSessions),
}));

export const usersRelations = relations(users, ({ many }) => ({
  gameSessions: many(gameSessions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  letter: one(letters, {
    fields: [questions.letterId],
    references: [letters.id],
  }),
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id],
  }),
  answer: one(answers, {
    fields: [questions.id],
    references: [answers.questionId],
  }),
  sessionQuestions: many(gameSessionQuestions),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));

export const gameSessionsRelations = relations(gameSessions, ({ many, one }) => ({
  currentLetter: many(letters),
  sessionQuestions: many(gameSessionQuestions),
  user: one(users, {
    fields: [gameSessions.userId],
    references: [users.id],
  }),
  quiz: one(quizzes, {
    fields: [gameSessions.quizId],
    references: [quizzes.id],
  }),
  currentQuestion: one(questions, {
    fields: [gameSessions.currentQuestionId],
    references: [questions.id],
  }),
}));

export const gameSessionQuestionsRelations = relations(gameSessionQuestions, ({ one }) => ({
  question: one(questions, {
    fields: [gameSessionQuestions.questionId],
    references: [questions.id],
  }),
  gameSession: one(gameSessions, {
    fields: [gameSessionQuestions.gameSessionId],
    references: [gameSessions.id],
  }),
}));
