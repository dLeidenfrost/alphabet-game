import { eq, and } from 'drizzle-orm';
import { getDb, persistDb } from './index';
import { users, gameSessions, gameSessionQuestions } from './schema';

export async function createUser(username: string): Promise<number> {
  const db = await getDb();

  const existing = db.select({ id: users.id }).from(users).where(eq(users.username, username)).all();
  if (existing.length > 0) return existing[0].id;

  db.insert(users).values({ username }).run();

  const created = db.select({ id: users.id }).from(users).where(eq(users.username, username)).get();
  await persistDb();
  return created!.id;
}

export async function createGameSession(params: {
  userId: number;
  quizId: number;
  currentQuestionId?: number;
  score?: number;
}): Promise<number> {
  const db = await getDb();

  db.insert(gameSessions).values({
    userId: params.userId,
    quizId: params.quizId,
    currentQuestionId: params.currentQuestionId ?? null,
    score: params.score ?? 0,
  }).run();

  const rows = db.select({ id: gameSessions.id })
    .from(gameSessions)
    .where(
      and(eq(gameSessions.userId, params.userId), eq(gameSessions.quizId, params.quizId)),
    )
    .orderBy(gameSessions.startedAt)
    .all();

  const { id } = rows[rows.length - 1];

  await persistDb();
  return id;
}

export async function upsertGameSessionQuestion(
  sessionId: number,
  questionId: number,
  isAnswered: boolean,
): Promise<number> {
  const db = await getDb();

  const existing = db
    .select({ id: gameSessionQuestions.id })
    .from(gameSessionQuestions)
    .where(
      and(
        eq(gameSessionQuestions.gameSessionId, sessionId),
        eq(gameSessionQuestions.questionId, questionId),
      ),
    )
    .get();

  if (existing) {
    db.update(gameSessionQuestions)
      .set({ isAnswered, updatedAt: new Date() })
      .where(eq(gameSessionQuestions.id, existing.id))
      .run();
    await persistDb();
    return existing.id;
  }

  db.insert(gameSessionQuestions).values({ gameSessionId: sessionId, questionId, isAnswered }).run();

  const created = db
    .select({ id: gameSessionQuestions.id })
    .from(gameSessionQuestions)
    .where(
      and(
        eq(gameSessionQuestions.gameSessionId, sessionId),
        eq(gameSessionQuestions.questionId, questionId),
      ),
    )
    .get()!;

  await persistDb();
  return created.id;
}
