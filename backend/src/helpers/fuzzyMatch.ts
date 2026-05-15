// Levenshtein distance - counts edits needed to transform one string to another
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function isValidAnswer(userAnswer: string, correctAnswer: string): boolean {
  const user = normalize(userAnswer);
  const correct = normalize(correctAnswer);

  // Fast checks first
  if (user === correct) return true;
  if (user.length < 3) return false;
  if (correct.includes(user)) return true;

  // Expensive fuzzy check last
  const maxDistance = Math.floor(user.length / 3);
  return levenshtein(user, correct) <= maxDistance;
}
