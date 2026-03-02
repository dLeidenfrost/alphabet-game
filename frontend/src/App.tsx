import { createSignal, onMount } from 'solid-js';
import ExampleComponent from './components/ExampleComponent';
import { getHealth } from './api';

function App() {
  const [backendStatus, setBackendStatus] = createSignal<string>('checking...');

  onMount(async () => {
    try {
      const health = await getHealth();
      setBackendStatus(`✓ Backend connected (${health.status})`);
    } catch (error) {
      setBackendStatus('✗ Backend not connected');
      console.error('Backend connection failed:', error);
    }
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div class="max-w-4xl mx-auto space-y-8">
        <header class="text-center">
          <h1 class="text-5xl font-bold text-gray-900 mb-4">
            Alphabet Game
          </h1>
          <p class="text-xl text-gray-600">
            Your alphabet challenge game starts here!
          </p>
          <p class="text-sm text-gray-500 mt-2">
            Backend: {backendStatus()}
          </p>
        </header>

        <main class="space-y-6">
          <ExampleComponent title="Example Component" />
          
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              Getting Started
            </h2>
            <div class="prose text-gray-600 space-y-2">
              <p>This is your starting template. Replace this with your game pages:</p>
              <ul class="list-disc list-inside space-y-1">
                <li>Create a game page component</li>
                <li>Add routing if needed (e.g., @solidjs/router)</li>
                <li>Build your question/answer interface</li>
                <li>Connect to your backend API</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
