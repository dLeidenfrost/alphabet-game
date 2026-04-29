import { A } from '@solidjs/router';
import { createSignal, JSX, onMount, Show } from 'solid-js';
import { getSession } from '../../helpers/cookies';

interface LayoutProps {
  children: JSX.Element;
}

export function Layout(props: LayoutProps) {
  const [user, setUser] = createSignal("");

  onMount(() => {
    const session = getSession();
    if (session?.username) {
      setUser(session.username);
    }
  });

  return (
    <div class="bg-white max-w-sm mx-auto">
      <header class="bg-white p-5">
        <div class="flex">
          <A href="/" class="flex items-center gap-2.5">
            <div class="size-8 rounded-lg bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center text-white font-bold text-[12.8px] shadow-[0_2px_8px_oklch(0.72_0.18_287/0.25)]">
              Az
            </div>
            <span class="text-xl font-normal text-black">Alphabetix</span>
          </A>
          <Show when={Boolean(user())}>
            <div class="ml-auto flex items-center gap-2">
              <div class="text-[13px] text-gray-500">Hi, {user()}</div>
              <div class="size-8 rounded-full bg-gradient-to-br from-gradient-start to-gradient-end text-white flex items-center justify-center text-xs font-bold">
                A
              </div>
            </div>
          </Show>
        </div>
      </header>
      <main class="px-4 pb-8 pt-4">
        {props.children}
      </main>
    </div>
  );
}
