import { createResource, createSignal, For, Show } from 'solid-js';
import Layout from '../components/Layout';
import { getQuizzes } from '../api';
import clsx from 'clsx';
import { A } from '@solidjs/router';

function HomeScreen() {
  const [data] = createResource(getQuizzes);
  const [selected, setSelected] = createSignal(0);

  function onClick(id: number) {
    if (id != null) {
      setSelected(id);
    }
  }

  function onStartQuiz(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <Layout>
      <div class="flex flex-col gap-2">
        <h2 class="text-2xl text-center text-title">Test your knowledge</h2>
        <h4 class="text-sm text-center text-subtitle">Answer one question for each letter of the alphabet before time runs out!</h4>
      </div>
      <Show when={!data.loading} fallback={<p>Loading...</p>}>
        <Show when={!data.error} fallback={<p>Error {data.error.message}</p>}>
          <ul class="mt-7 flex flex-col gap-3">
            <For each={data()}>
              {(item) => {
                return (
                  <li role="button" onClick={() => onClick(item.id)} class={clsx("rounded-lg hover:bg-primary hover:text-white h-full w-full p-4", selected() === item.id ? "bg-primary" : "bg-list-item")}>
                    <div class="flex items-center gap-2">
                      <div class="bg-slate-200 w-8 h-8 rounded-lg" />
                      <div class={clsx(selected() === item.id && "text-white")}>{item.quizName}</div>
                    </div>
                    <Show when={item.id === selected()}>
                      <div class="border-t border-gray-200 mt-4 pt-4 text-left flex flex-col gap-4">
                        <p class="text-sm text-white/85">Test your scientific knowledge from the periodic table to the laws of physics.</p>
                        <div class="flex items-center gap-3 text-sm">
                          <div class="flex items-center gap-1">
                            <p class="text-white">26</p>
                            <p class="text-white/60">questions</p>
                          </div>
                          <div class="flex items-center gap-1">
                            <p class="text-white">5:00</p>
                            <p class="text-white/60">time</p>
                          </div>
                          <div class="flex items-center gap-1">
                            <p class="text-white">Medium</p>
                          </div>
                        </div>
                        <A href="/play">
                          <button class="h-11 w-full rounded-lg bg-secondary text-white hover:bg-secondary/60 hover:cursor-pointer" onClick={onStartQuiz}>Start quiz</button>
                        </A>
                      </div>
                    </Show>
                  </li>
                )
              }}
            </For>
          </ul>
        </Show>
      </Show>
    </Layout>
  );
}

export default HomeScreen;
