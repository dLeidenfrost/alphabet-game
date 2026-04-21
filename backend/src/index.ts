import Fastify from 'fastify';
import cors from '@fastify/cors';
import { db } from './db';
import { answers, gameSessionQuestions, gameSessions, letters, questions, quizzes, users } from './db/schema';
import { and, eq, sql } from 'drizzle-orm';

const fastify = Fastify({
  logger: true,
});

// Enable CORS for frontend
await fastify.register(cors, {
  origin: 'http://localhost:5173', // Vite default port
});

fastify.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

fastify.post<{ Body: { quiz: string } }>('/api/quizzes/create', async (request) => {
  const { quiz } = request.body;
  if (quiz) {
    try {
      await db.insert(quizzes).values({ quizName: quiz });
      return { message: `Quiz created successfully (${quiz})` };
    } catch (e) {
      console.error('Error adding quiz ', e);
      return;
    }
  }
  return { message: 'No quiz added' };
});

fastify.post<{ Body: { user: string } }>('/api/users/create', async (request) => {
  const { user } = request.body;
  if (user) {
    try {
      await db.insert(users).values({ username: user });
      return { message: `User created successfully (${user})` };
    } catch (e) {
      console.error('Error adding user ', e);
      return;
    }
  }
  return { message: `No user added (${user})` };
});

fastify.post<{ Body: { question: string, quizId: number, letterId: number } }>('/api/questions/create', async (request) => {
  const { question, quizId, letterId } = request.body;
  if (question && quizId && letterId) {
    try {
      const quiz = await db.query.quizzes.findFirst({ where: eq(quizzes.id, quizId) });
      const letter = await db.query.letters.findFirst({ where: eq(letters.id, letterId) });
      if (quiz?.id && letter?.id) {
        await db.insert(questions).values({ question, quizId: quiz.id, letterId: letter.id });
        return { message: `Question created successfully (${question})` };
      }
    } catch (e) {
      console.error('Error adding question ', e);
      return;
    }
  }
  return { message: 'Question not added' };
});

fastify.post<{ Body: { answer: string, questionId: number } }>('/api/answers/create', async (request) => {
  const { answer, questionId } = request.body;
  if (answer && questionId) {
    try {
      const question = await db.query.questions.findFirst({ where: eq(questions.id, questionId) });
      if (question?.id) {
        await db.insert(answers).values({ questionId: question.id, answer });
        return { message: `Answer created successfully (${answer})` };
      }
    } catch (e) {
      console.error('Error adding answer', e);
      return;
    }
  }
  return { message: 'Answer not added' };
});

fastify.post<{ Body: { userId: number, quizId: number, currentQuestionId: number, score: number } }>('/api/game-sessions/create', async (request) => {
  const { userId, quizId, currentQuestionId, score } = request.body;
  if (userId && quizId) {
    try {
      const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
      const quiz = await db.query.quizzes.findFirst({ where: eq(quizzes.id, quizId) });
      const question = await db.query.questions.findFirst({ where: eq(questions.id, currentQuestionId ?? 0) });
      if (quiz?.id && user?.id) {
        await db.insert(gameSessions).values({ quizId: quiz.id, userId: user.id, currentQuestionId: question?.id, score })
        return { message: `Game session started for user (${user?.username})` };
      }
    } catch (e) {
      console.error('Error starting game session', e);
      return;
    }
  }
  return { message: 'Cannnot initiate game session (missing parameters)' };
});

fastify.post<{ Body: { questionId: number, gameSessionId: number, isAnswered: boolean } }>('/api/game-sessions-questions/create', async (request) => {
  const { questionId, gameSessionId, isAnswered } = request.body;
  if (questionId && gameSessionId) {
    try {
      const gameSession = await db.query.gameSessions.findFirst({ where: eq(gameSessions.id, gameSessionId) });
      const question = await db.query.questions.findFirst({ where: eq(questions.id, questionId) });
      if (question?.id && gameSession?.id) {
        await db.insert(gameSessionQuestions).values({ questionId: question.id, gameSessionId: gameSession.id, isAnswered });
        return { message: `Questions added for game session (${gameSession.id})` };
      }
    } catch (e) {
      console.error('Error adding questions to game session', e);
      return;
    }
  }
  return { message: 'Cannnot add questions to game session (missing parameters)' };
});

fastify.get<{ Params: { id: string } }>('/api/users/:id', async (request, reply) => {
  const id = Number(request.params.id);
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!user) return reply.code(404).send({ message: 'User not found' });
  return user;
});

fastify.get<{ Querystring: { page?: string; rowsPerPage?: string } }>('/api/quizzes', async (request) => {
  const page = Math.max(1, Number(request.query.page ?? 1));
  const rowsPerPage = Math.min(100, Math.max(1, Number(request.query.rowsPerPage ?? 10)));
  const offset = (page - 1) * rowsPerPage;

  const [{ total }] = await db.select({ total: sql<number>`count(*)` }).from(quizzes);
  const data = await db.query.quizzes.findMany({ limit: rowsPerPage, offset });

  return {
    data,
    total,
    totalPages: Math.ceil(total / rowsPerPage),
  };
});

fastify.get<{ Querystring: { quizId: string, letterId: string } }>('/api/questions', async (request, reply) => {
  const quizId = Number(request.query.quizId);
  const letterId = Number(request.query.letterId);
  if (!quizId || !letterId) return reply.code(400).send({ message: 'quizId and letterId are required' });
  const question = await db.query.questions.findFirst({
    where: and(eq(questions.quizId, quizId), eq(questions.letterId, letterId)),
  });
  if (!question) return reply.code(404).send({ message: 'Question not found' });
  return question;
});

fastify.get<{ Params: { id: string } }>('/api/quizzes/:id/questions', async (request, reply) => {
  const quizId = Number(request.params.id);
  const quiz = await db.query.quizzes.findFirst({ where: eq(quizzes.id, quizId) });
  if (!quiz) return reply.code(404).send({ message: 'Quiz not found' });
  const result = await db
    .select({ hint: questions.hint, question: questions.question })
    .from(questions)
    .where(eq(questions.quizId, quizId));
  return result;
});

fastify.get('/api/letters', async () => {
  return db.query.letters.findMany();
});

fastify.get<{ Querystring: { questionId: string, answer: string } }>('/api/answers/validate', async (request, reply) => {
  const questionId = Number(request.query.questionId);
  const { answer } = request.query;
  if (!questionId || !answer) return reply.code(400).send({ message: 'questionId and answer are required' });
  const stored = await db.query.answers.findFirst({ where: eq(answers.questionId, questionId) });
  if (!stored) return reply.code(404).send({ message: 'Answer not found for this question' });
  const isCorrect = stored.answer.toLowerCase() === answer.toLowerCase();
  return { isCorrect };
});

fastify.patch<{ Body: { gameSessionQuestionId: number, isAnswered: boolean } }>('/api/game-sessions-questions/update', async (request) => {
  const { gameSessionQuestionId, isAnswered } = request.body;
  if (gameSessionQuestionId && isAnswered != null) {
    try {
      await db.update(gameSessionQuestions).set({ isAnswered }).where(eq(gameSessionQuestions.id, gameSessionQuestionId));
      return { message: `Game session question updated (${gameSessionQuestionId})` };
    } catch (e) {
      console.error('Error updating game session question', e);
      return;
    }
  }
  return { message: 'Game session question not updated (missing parameters)' };
});

async function populateLettersTable() {
  // Check if table is empty
  const row = await db.query.letters.findFirst();
  if (row?.id) {
    console.log('Nothing to load into letters table.');
    return;
  }
  const lettersToInsert: string = 'abcdefghijklmnopqrstuvwxyz';
  const insertList = [];
  for (const letter of lettersToInsert) {
    insertList.push({ letter });
  }
  await db.insert(letters).values(insertList);
}

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    await populateLettersTable();
    console.log('Server running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
