import { JSX } from 'solid-js';

interface LayoutProps {
  children: JSX.Element;
}

function Layout(props: LayoutProps) {
  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header class="bg-white shadow-sm px-6 py-4 flex items-center gap-3">
        {/* TODO: Replace placeholder logo with real logo */}
        <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
          A
        </div>
        <span class="text-xl font-bold text-primary">Alphabet Game</span>
      </header>
      <main class="max-w-4xl mx-auto px-4 py-8">
        {props.children}
      </main>
    </div>
  );
}

export default Layout;
