import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// EXAMPLE SCHEMA - Replace with your own tables
// 
// For your alphabet game, you might want tables like:
// - users: to track players
// - game_sessions: to track game progress
// - questions: to store questions for each letter
// - answers: to store user answers
//
// Example table:
export const exampleTable = sqliteTable('example', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Uncomment and customize for your game:
/*
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const gameSessions = sqliteTable('game_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  currentLetter: text('current_letter').notNull(),
  score: integer('score').default(0),
  startedAt: integer('started_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
});
*/
