/**
 * Seed script — run from backend/ directory:
 *   bun run db:seed
 */
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { eq } from 'drizzle-orm';
import * as schema from '../src/db/schema';

const sqlite = new Database('./sqlite.db');
const db = drizzle(sqlite, { schema });

// ─── Letter list (mirrors server auto-populate logic) ────────────────────────

const LETTERS = [
  'a','b','c','d','e','f','g','h','i','j','k','l','m',
  'n','ñ','o','p','q','r','s','t','u','v','w','x','y','z',
];

// ─── Seed data ────────────────────────────────────────────────────────────────

type Entry = { answer: string; startsWith: boolean };
type QuizDef = { name: string; label: string; data: Record<string, Entry> };

const quizDefinitions: QuizDef[] = [
  // ── 1. Classic Video Games ─────────────────────────────────────────────────
  {
    name: 'Classic Video Games',
    label: 'classic video game',
    data: {
      a: { answer: 'Asteroids',              startsWith: true  },
      b: { answer: 'Battletoads',            startsWith: true  },
      c: { answer: 'Contra',                 startsWith: true  },
      d: { answer: 'Donkey Kong',            startsWith: true  },
      e: { answer: 'Excitebike',             startsWith: true  },
      f: { answer: 'Frogger',               startsWith: true  },
      g: { answer: 'Galaga',                startsWith: true  },
      h: { answer: 'H.E.R.O.',              startsWith: true  },
      i: { answer: 'Ice Climber',           startsWith: true  },
      j: { answer: 'Joust',                 startsWith: true  },
      k: { answer: "King's Quest",          startsWith: true  },
      l: { answer: 'Lunar Lander',          startsWith: true  },
      m: { answer: 'Mega Man',              startsWith: true  },
      n: { answer: 'Ninja Gaiden',          startsWith: true  },
      ñ: { answer: 'Piñata: Survival Island', startsWith: false },
      o: { answer: 'Out Run',               startsWith: true  },
      p: { answer: 'Pac-Man',              startsWith: true  },
      q: { answer: 'Q*bert',               startsWith: true  },
      r: { answer: 'River City Ransom',     startsWith: true  },
      s: { answer: 'Space Invaders',        startsWith: true  },
      t: { answer: 'Tetris',               startsWith: true  },
      u: { answer: 'Ultima',               startsWith: true  },
      v: { answer: 'Virtua Fighter',        startsWith: true  },
      w: { answer: 'Wolfenstein 3D',        startsWith: true  },
      x: { answer: 'Xenon',                startsWith: true  },
      y: { answer: "Yars' Revenge",         startsWith: true  },
      z: { answer: 'Zaxxon',               startsWith: true  },
    },
  },

  // ── 2. Modern Video Games ──────────────────────────────────────────────────
  {
    name: 'Modern Video Games',
    label: 'modern video game',
    data: {
      a: { answer: 'Apex Legends',               startsWith: true  },
      b: { answer: "Baldur's Gate 3",            startsWith: true  },
      c: { answer: 'Cyberpunk 2077',             startsWith: true  },
      d: { answer: 'Destiny 2',                  startsWith: true  },
      e: { answer: 'Elden Ring',                 startsWith: true  },
      f: { answer: 'Fortnite',                   startsWith: true  },
      g: { answer: 'God of War Ragnarök',        startsWith: true  },
      h: { answer: 'Hollow Knight',              startsWith: true  },
      i: { answer: 'It Takes Two',               startsWith: true  },
      j: { answer: 'Jedi: Survivor',             startsWith: true  },
      k: { answer: 'Kingdom Come: Deliverance',  startsWith: true  },
      l: { answer: 'Lies of P',                  startsWith: true  },
      m: { answer: "Marvel's Spider-Man 2",      startsWith: true  },
      n: { answer: "No Man's Sky",               startsWith: true  },
      ñ: { answer: 'Viva Piñata',                startsWith: false },
      o: { answer: 'Overwatch 2',                startsWith: true  },
      p: { answer: 'Palworld',                   startsWith: true  },
      q: { answer: 'Quake Champions',            startsWith: true  },
      r: { answer: 'Red Dead Redemption 2',      startsWith: true  },
      s: { answer: 'Sekiro: Shadows Die Twice',  startsWith: true  },
      t: { answer: 'The Witcher 3: Wild Hunt',   startsWith: true  },
      u: { answer: 'Uncharted 4',                startsWith: true  },
      v: { answer: 'Valorant',                   startsWith: true  },
      w: { answer: 'Warzone',                    startsWith: true  },
      x: { answer: 'Xenoblade Chronicles 3',     startsWith: true  },
      y: { answer: 'Yakuza: Like a Dragon',      startsWith: true  },
      z: { answer: 'Zelda: Tears of the Kingdom', startsWith: true },
    },
  },

  // ── 3. Nintendo Games ──────────────────────────────────────────────────────
  {
    name: 'Nintendo Games',
    label: 'Nintendo game',
    data: {
      a: { answer: 'Animal Crossing: New Horizons',    startsWith: true  },
      b: { answer: 'Bayonetta',                        startsWith: true  },
      c: { answer: 'Captain Toad: Treasure Tracker',   startsWith: true  },
      d: { answer: 'Donkey Kong Country Returns',      startsWith: true  },
      e: { answer: 'EarthBound',                       startsWith: true  },
      f: { answer: 'Fire Emblem: Three Houses',        startsWith: true  },
      g: { answer: 'Golden Sun',                       startsWith: true  },
      h: { answer: 'Hyrule Warriors',                  startsWith: true  },
      i: { answer: 'Ice Climber',                      startsWith: true  },
      j: { answer: 'Jump Rope Challenge',              startsWith: true  },
      k: { answer: "Kirby's Adventure",                startsWith: true  },
      l: { answer: "Luigi's Mansion 3",                startsWith: true  },
      m: { answer: 'Mario Kart 8 Deluxe',              startsWith: true  },
      n: { answer: 'New Super Mario Bros. U Deluxe',   startsWith: true  },
      ñ: { answer: 'Piñata (Animal Crossing event item)', startsWith: false },
      o: { answer: 'Ocarina of Time',                  startsWith: true  },
      p: { answer: 'Pikmin 4',                         startsWith: true  },
      q: { answer: 'Quest 64',                         startsWith: true  },
      r: { answer: 'Ring Fit Adventure',               startsWith: true  },
      s: { answer: 'Splatoon 3',                       startsWith: true  },
      t: { answer: 'Tomodachi Life',                   startsWith: true  },
      u: { answer: 'Urban Champion',                   startsWith: true  },
      v: { answer: 'Vs. Excitebike',                   startsWith: true  },
      w: { answer: 'Wii Sports',                       startsWith: true  },
      x: { answer: 'Xenoblade Chronicles',             startsWith: true  },
      y: { answer: "Yoshi's Island",                   startsWith: true  },
      z: { answer: 'Zelda: Breath of the Wild',        startsWith: true  },
    },
  },

  // ── 4. Video Game Characters ───────────────────────────────────────────────
  {
    name: 'Video Game Characters',
    label: 'video game character',
    data: {
      a: { answer: 'Aloy',             startsWith: true  },
      b: { answer: 'Bowser',           startsWith: true  },
      c: { answer: 'Cloud Strife',     startsWith: true  },
      d: { answer: 'Donkey Kong',      startsWith: true  },
      e: { answer: 'Ellie',            startsWith: true  },
      f: { answer: 'Fox McCloud',      startsWith: true  },
      g: { answer: 'Geralt of Rivia',  startsWith: true  },
      h: { answer: 'Handsome Jack',    startsWith: true  },
      i: { answer: 'Isaac Clarke',     startsWith: true  },
      j: { answer: 'Jill Valentine',   startsWith: true  },
      k: { answer: 'Kratos',           startsWith: true  },
      l: { answer: 'Link',             startsWith: true  },
      m: { answer: 'Mario',            startsWith: true  },
      n: { answer: 'Nathan Drake',     startsWith: true  },
      ñ: { answer: 'Piñata (Viva Piñata creature)', startsWith: false },
      o: { answer: 'Ori',              startsWith: true  },
      p: { answer: 'Pikachu',          startsWith: true  },
      q: { answer: 'Quiet',            startsWith: true  },
      r: { answer: 'Ryu',              startsWith: true  },
      s: { answer: 'Samus Aran',       startsWith: true  },
      t: { answer: 'Tifa Lockhart',    startsWith: true  },
      u: { answer: 'Undyne',           startsWith: true  },
      v: { answer: 'Vaan',             startsWith: true  },
      w: { answer: 'Wario',            startsWith: true  },
      x: { answer: 'X (Mega Man X)',   startsWith: true  },
      y: { answer: 'Yoshi',            startsWith: true  },
      z: { answer: 'Zelda',            startsWith: true  },
    },
  },

  // ── 5. Classic Movies ──────────────────────────────────────────────────────
  {
    name: 'Classic Movies',
    label: 'classic movie',
    data: {
      a: { answer: 'Alien',                         startsWith: true  },
      b: { answer: 'Ben-Hur',                       startsWith: true  },
      c: { answer: 'Casablanca',                    startsWith: true  },
      d: { answer: 'Dr. Strangelove',               startsWith: true  },
      e: { answer: 'E.T. the Extra-Terrestrial',    startsWith: true  },
      f: { answer: 'Forrest Gump',                  startsWith: true  },
      g: { answer: 'Goodfellas',                    startsWith: true  },
      h: { answer: 'Home Alone',                    startsWith: true  },
      i: { answer: "It's a Wonderful Life",         startsWith: true  },
      j: { answer: 'Jaws',                          startsWith: true  },
      k: { answer: 'King Kong',                     startsWith: true  },
      l: { answer: 'Lawrence of Arabia',            startsWith: true  },
      m: { answer: 'Metropolis',                    startsWith: true  },
      n: { answer: 'North by Northwest',            startsWith: true  },
      ñ: { answer: 'Doña Flor and Her Two Husbands', startsWith: false },
      o: { answer: 'On the Waterfront',             startsWith: true  },
      p: { answer: 'Psycho',                        startsWith: true  },
      q: { answer: 'Quiz Show',                     startsWith: true  },
      r: { answer: 'Rear Window',                   startsWith: true  },
      s: { answer: "Schindler's List",              startsWith: true  },
      t: { answer: 'The Godfather',                 startsWith: true  },
      u: { answer: 'Unforgiven',                    startsWith: true  },
      v: { answer: 'Vertigo',                       startsWith: true  },
      w: { answer: 'West Side Story',               startsWith: true  },
      x: { answer: 'Xanadu',                        startsWith: true  },
      y: { answer: 'Yankee Doodle Dandy',           startsWith: true  },
      z: { answer: 'Zulu',                          startsWith: true  },
    },
  },

  // ── 6. Action Movies ───────────────────────────────────────────────────────
  {
    name: 'Action Movies',
    label: 'action movie',
    data: {
      a: { answer: 'Avengers: Endgame',        startsWith: true  },
      b: { answer: 'Black Hawk Down',          startsWith: true  },
      c: { answer: 'Commando',                 startsWith: true  },
      d: { answer: 'Die Hard',                 startsWith: true  },
      e: { answer: 'Edge of Tomorrow',         startsWith: true  },
      f: { answer: 'Fast and Furious',         startsWith: true  },
      g: { answer: 'Gladiator',                startsWith: true  },
      h: { answer: 'Heat',                     startsWith: true  },
      i: { answer: 'Independence Day',         startsWith: true  },
      j: { answer: 'John Wick',                startsWith: true  },
      k: { answer: 'Kill Bill',                startsWith: true  },
      l: { answer: 'Lethal Weapon',            startsWith: true  },
      m: { answer: 'Mad Max: Fury Road',       startsWith: true  },
      n: { answer: 'No Time to Die',           startsWith: true  },
      ñ: { answer: 'Piñata: Survival Island',  startsWith: false },
      o: { answer: "Ocean's Eleven",           startsWith: true  },
      p: { answer: 'Predator',                 startsWith: true  },
      q: { answer: 'Quantum of Solace',        startsWith: true  },
      r: { answer: 'RoboCop',                  startsWith: true  },
      s: { answer: 'Speed',                    startsWith: true  },
      t: { answer: 'Terminator 2: Judgment Day', startsWith: true },
      u: { answer: 'Unstoppable',              startsWith: true  },
      v: { answer: 'V for Vendetta',           startsWith: true  },
      w: { answer: 'Wonder Woman',             startsWith: true  },
      x: { answer: 'XXX',                      startsWith: true  },
      y: { answer: 'Yojimbo',                  startsWith: true  },
      z: { answer: 'Zorro',                    startsWith: true  },
    },
  },

  // ── 7. Animated Movies ─────────────────────────────────────────────────────
  {
    name: 'Animated Movies',
    label: 'animated movie',
    data: {
      a: { answer: 'Aladdin',                       startsWith: true  },
      b: { answer: 'Beauty and the Beast',          startsWith: true  },
      c: { answer: 'Coco',                          startsWith: true  },
      d: { answer: 'Dumbo',                         startsWith: true  },
      e: { answer: 'Encanto',                       startsWith: true  },
      f: { answer: 'Finding Nemo',                  startsWith: true  },
      g: { answer: 'Grave of the Fireflies',        startsWith: true  },
      h: { answer: 'How to Train Your Dragon',      startsWith: true  },
      i: { answer: 'Inside Out',                    startsWith: true  },
      j: { answer: 'Jimmy Neutron: Boy Genius',     startsWith: true  },
      k: { answer: 'Kung Fu Panda',                 startsWith: true  },
      l: { answer: 'Lilo & Stitch',                 startsWith: true  },
      m: { answer: 'Moana',                         startsWith: true  },
      n: { answer: 'Nausicaä of the Valley of the Wind', startsWith: true },
      ñ: { answer: 'Viva Piñata',                   startsWith: false },
      o: { answer: 'Over the Hedge',                startsWith: true  },
      p: { answer: 'Pinocchio',                     startsWith: true  },
      q: { answer: 'Quest for Camelot',             startsWith: true  },
      r: { answer: 'Ratatouille',                   startsWith: true  },
      s: { answer: 'Shrek',                         startsWith: true  },
      t: { answer: 'Toy Story',                     startsWith: true  },
      u: { answer: 'Up',                            startsWith: true  },
      v: { answer: 'Valiant',                       startsWith: true  },
      w: { answer: 'WALL-E',                        startsWith: true  },
      x: { answer: 'Asterix and the Vikings',       startsWith: false },
      y: { answer: 'Yellow Submarine',              startsWith: true  },
      z: { answer: 'Zootopia',                      startsWith: true  },
    },
  },

  // ── 8. Soccer Players ──────────────────────────────────────────────────────
  {
    name: 'Soccer Players',
    label: 'soccer player',
    data: {
      a: { answer: 'Antoine Griezmann',  startsWith: true  },
      b: { answer: 'Bukayo Saka',        startsWith: true  },
      c: { answer: 'Cristiano Ronaldo',  startsWith: true  },
      d: { answer: 'Declan Rice',        startsWith: true  },
      e: { answer: 'Erling Haaland',     startsWith: true  },
      f: { answer: 'Frenkie de Jong',    startsWith: true  },
      g: { answer: 'Gavi',              startsWith: true  },
      h: { answer: 'Harry Kane',         startsWith: true  },
      i: { answer: 'Ilkay Gündogan',     startsWith: true  },
      j: { answer: 'Jude Bellingham',    startsWith: true  },
      k: { answer: 'Kylian Mbappé',      startsWith: true  },
      l: { answer: 'Luka Modric',        startsWith: true  },
      m: { answer: 'Mohamed Salah',      startsWith: true  },
      n: { answer: 'Neymar',            startsWith: true  },
      ñ: { answer: 'Iñigo Martínez',     startsWith: false },
      o: { answer: 'Ousmane Dembélé',    startsWith: true  },
      p: { answer: 'Pedri',             startsWith: true  },
      q: { answer: 'Quincy Promes',      startsWith: true  },
      r: { answer: 'Roberto Firmino',    startsWith: true  },
      s: { answer: 'Sergio Busquets',    startsWith: true  },
      t: { answer: 'Toni Kroos',         startsWith: true  },
      u: { answer: 'Unai Simón',         startsWith: true  },
      v: { answer: 'Virgil van Dijk',    startsWith: true  },
      w: { answer: 'Wojciech Szczęsny',  startsWith: true  },
      x: { answer: 'Xavi Simons',        startsWith: true  },
      y: { answer: 'Yannick Carrasco',   startsWith: true  },
      z: { answer: 'Zlatan Ibrahimović', startsWith: true  },
    },
  },

  // ── 9. Soccer Teams ────────────────────────────────────────────────────────
  {
    name: 'Soccer Teams',
    label: 'soccer team',
    data: {
      a: { answer: 'Ajax',                       startsWith: true  },
      b: { answer: 'Barcelona',                  startsWith: true  },
      c: { answer: 'Chelsea',                    startsWith: true  },
      d: { answer: 'Deportivo Alavés',           startsWith: true  },
      e: { answer: 'Everton',                    startsWith: true  },
      f: { answer: 'Flamengo',                   startsWith: true  },
      g: { answer: 'Galatasaray',                startsWith: true  },
      h: { answer: 'Hamburg SV',                 startsWith: true  },
      i: { answer: 'Inter Milan',                startsWith: true  },
      j: { answer: 'Juventus',                   startsWith: true  },
      k: { answer: 'Kaiserslautern',             startsWith: true  },
      l: { answer: 'Liverpool',                  startsWith: true  },
      m: { answer: 'Manchester City',            startsWith: true  },
      n: { answer: 'Napoli',                     startsWith: true  },
      ñ: { answer: 'Peñarol',                    startsWith: false },
      o: { answer: 'Olympique de Marseille',     startsWith: true  },
      p: { answer: 'Paris Saint-Germain',        startsWith: true  },
      q: { answer: 'Queens Park Rangers',        startsWith: true  },
      r: { answer: 'Real Madrid',                startsWith: true  },
      s: { answer: 'Sevilla',                    startsWith: true  },
      t: { answer: 'Tottenham Hotspur',          startsWith: true  },
      u: { answer: 'Udinese',                    startsWith: true  },
      v: { answer: 'Valencia',                   startsWith: true  },
      w: { answer: 'Wolverhampton Wanderers',    startsWith: true  },
      x: { answer: 'Xerez CD',                   startsWith: true  },
      y: { answer: 'Young Boys',                 startsWith: true  },
      z: { answer: 'Zaragoza',                   startsWith: true  },
    },
  },

  // ── 10. Soccer Legends ─────────────────────────────────────────────────────
  {
    name: 'Soccer Legends',
    label: 'soccer legend',
    data: {
      a: { answer: 'Alfredo Di Stéfano', startsWith: true  },
      b: { answer: 'Bobby Charlton',     startsWith: true  },
      c: { answer: 'Carlos Alberto',     startsWith: true  },
      d: { answer: 'Diego Maradona',     startsWith: true  },
      e: { answer: 'Eusébio',           startsWith: true  },
      f: { answer: 'Ferenc Puskás',      startsWith: true  },
      g: { answer: 'George Best',        startsWith: true  },
      h: { answer: 'Hugo Sánchez',       startsWith: true  },
      i: { answer: 'Ian Rush',           startsWith: true  },
      j: { answer: 'Jairzinho',          startsWith: true  },
      k: { answer: 'Kevin Keegan',       startsWith: true  },
      l: { answer: 'Lothar Matthäus',    startsWith: true  },
      m: { answer: 'Michel Platini',     startsWith: true  },
      n: { answer: 'Nwankwo Kanu',       startsWith: true  },
      ñ: { answer: 'Miguel Muñoz',       startsWith: false },
      o: { answer: 'Osvaldo Ardiles',    startsWith: true  },
      p: { answer: 'Pelé',              startsWith: true  },
      q: { answer: 'Quini',             startsWith: true  },
      r: { answer: 'Ronaldo Nazário',    startsWith: true  },
      s: { answer: 'Socrates',          startsWith: true  },
      t: { answer: 'Thierry Henry',      startsWith: true  },
      u: { answer: 'Uwe Seeler',         startsWith: true  },
      v: { answer: 'Valderrama',         startsWith: true  },
      w: { answer: 'Wayne Rooney',       startsWith: true  },
      x: { answer: 'Xavi Hernández',     startsWith: true  },
      y: { answer: 'Yaya Touré',         startsWith: true  },
      z: { answer: 'Zico',              startsWith: true  },
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildQuestion(label: string, letter: string, startsWith: boolean): string {
  const upper = letter.toUpperCase();
  return startsWith
    ? `Name a ${label} that starts with the letter "${upper}"`
    : `Name a ${label} that contains the letter "${upper}"`;
}

function buildHint(letter: string, startsWith: boolean): string {
  const upper = letter.toUpperCase();
  return startsWith
    ? `The answer starts with the letter "${upper}"`
    : `The answer contains the letter "${upper}"`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱  Starting seed...\n');

  // 1. Ensure all 27 letters (a–z + ñ) exist
  console.log('  Ensuring all letters are present...');
  for (const letter of LETTERS) {
    db.insert(schema.letters).values({ letter }).onConflictDoNothing().run();
  }
  const letterCount = db.select().from(schema.letters).all().length;
  console.log(`  Letters in DB: ${letterCount}`);

  // Build letter lookup: letter char → row id
  const letterRows = db.select().from(schema.letters).all();
  const letterIdMap = new Map(letterRows.map(r => [r.letter, r.id]));

  // 2. Insert user
  console.log('  Inserting user "Player 1"...');
  db.insert(schema.users)
    .values({ username: 'Player 1' })
    .onConflictDoNothing()
    .run();

  const userRow = db.select().from(schema.users).where(eq(schema.users.username, 'Player 1')).get();
  if (!userRow) throw new Error('Failed to find/create user');
  console.log(`  User id: ${userRow.id}`);

  // 3. Insert quizzes + questions + answers
  let totalQuestions = 0;

  for (const quiz of quizDefinitions) {
    console.log(`\n  Quiz: "${quiz.name}"`);

    // Insert quiz
    db.insert(schema.quizzes).values({ quizName: quiz.name }).onConflictDoNothing().run();
    const quizRow = db.select().from(schema.quizzes).where(eq(schema.quizzes.quizName, quiz.name)).get();
    if (!quizRow) throw new Error(`Failed to find/create quiz: ${quiz.name}`);

    for (const letter of LETTERS) {
      const entry = quiz.data[letter];
      if (!entry) {
        console.warn(`    ⚠  No answer defined for letter "${letter}" in quiz "${quiz.name}"`);
        continue;
      }

      const letterId = letterIdMap.get(letter);
      if (!letterId) {
        console.warn(`    ⚠  Letter "${letter}" not found in DB`);
        continue;
      }

      const questionText = buildQuestion(quiz.label, letter, entry.startsWith);
      const hintText = buildHint(letter, entry.startsWith);

      // Check if question already exists for this quiz+letter combo
      const existing = db
        .select()
        .from(schema.questions)
        .where(eq(schema.questions.quizId, quizRow.id))
        .all()
        .find(q => q.letterId === letterId);

      if (existing) {
        console.log(`    ↩  letter "${letter}" already seeded, skipping.`);
        continue;
      }

      // Insert question
      const questionResult = db
        .insert(schema.questions)
        .values({ question: questionText, hint: hintText, quizId: quizRow.id, letterId })
        .returning({ id: schema.questions.id })
        .get();

      // Insert answer
      db.insert(schema.answers)
        .values({ answer: entry.answer, questionId: questionResult.id })
        .run();

      totalQuestions++;
    }

    console.log(`    ✓  ${LETTERS.length} questions inserted for "${quiz.name}"`);
  }

  console.log(`\n✅  Seed complete!`);
  console.log(`   Quizzes   : ${quizDefinitions.length}`);
  console.log(`   Questions : ${totalQuestions}`);
  console.log(`   Answers   : ${totalQuestions} (1 per question)`);
  console.log(`   User      : Player 1 (id ${userRow.id})`);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
