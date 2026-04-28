import { A } from '@solidjs/router';
import { JSX } from 'solid-js';

interface LayoutProps {
  children: JSX.Element;
}

export function Layout(props: LayoutProps) {
  return (
    <div class="bg-white max-w-sm mx-auto">
      <header class="bg-white p-5 border-b border-gray-200">
        <div class="flex">
          <A href="/" class="flex items-center gap-2.5">
            <div class="w-8 h-8 flex items-center justify-center rounded-lg text-white font-semibold text-sm bg-gradient-to-b from-[oklch(0.72_0.18_287)] to-[oklch(0.47_0.03_299)]">Az</div>
            <span class="text-xl font-normal text-black">Alphabetix</span>
          </A>
        </div>
      </header>
      <main class="px-4 py-8">
        {props.children}
      </main>
    </div>
  );
}
