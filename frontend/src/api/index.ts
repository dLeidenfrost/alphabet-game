// Example API utility for making requests to your backend

const API_BASE = '/api'; // Proxied through Vite to http://localhost:3000

export async function checkAnswer(letter: string, answer: string) {
  const response = await fetch(`${API_BASE}/check-answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ letter, answer }),
  });

  if (!response.ok) {
    throw new Error('Failed to check answer');
  }

  return response.json();
}

export async function getHealth() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) {
    throw new Error('Failed to get health status');
  }
  return response.json();
}

// Add more API functions as you build your game
