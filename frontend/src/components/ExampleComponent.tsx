import { createSignal } from 'solid-js';

interface ExampleComponentProps {
  title: string;
}

export default function ExampleComponent(props: ExampleComponentProps) {
  const [count, setCount] = createSignal(0);

  return (
    <div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-4">
      <h2 class="text-2xl font-bold text-gray-900">{props.title}</h2>
      <div class="space-y-2">
        <p class="text-gray-600">Count: {count()}</p>
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={() => setCount(count() + 1)}
        >
          Increment
        </button>
      </div>
    </div>
  );
}
