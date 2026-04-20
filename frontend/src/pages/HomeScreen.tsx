import { createEffect, createResource, createSignal, For, onCleanup, Show } from 'solid-js';
import Layout from '../components/Layout';
import { getQuizzes, Quiz } from '../api';
import clsx from 'clsx';
import { A } from '@solidjs/router';
import { Button } from '../components/Button';

function HomeScreen() {
  const [page, setPage] = createSignal(1);
  const [data] = createResource(() => ({ rowsPerPage: 6, page: page() }), getQuizzes);
  const [selected, setSelected] = createSignal(0);
  const [quizzes, setQuizzes] = createSignal<Quiz[]>([]);
  const [total, setTotal] = createSignal(0);

  let observer: IntersectionObserver;

  function onClick(id: number) {
    if (id != null) {
      setSelected(id);
    }
  }

  function onStartQuiz(e: MouseEvent) {
    e.stopPropagation();
  }

  createEffect(() => {
    if (data()) {
      setQuizzes(prev => [...prev, ...data()?.data ?? []]);
      setTotal(data()?.total ?? 0);
    }
  });

  const hasMore = () => quizzes().length < total();

  function setLoaderRef(el: HTMLDivElement) {
    observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !data.loading && hasMore()) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 0.1 });

    observer.observe(el);

    onCleanup(() => observer?.disconnect());
  }

  return (
    <Layout>
      <div class="flex flex-col gap-2">
        <h2 class="text-2xl text-center text-title">Test your knowledge</h2>
        <h4 class="text-sm text-center text-subtitle">Answer one question for each letter of the alphabet before time runs out!</h4>
      </div>
      <Show when={!data.loading || quizzes().length > 0} fallback={<p>Loading...</p>}>
        <Show when={!data.error} fallback={<p>Error {data.error.message}</p>}>
          <ul class="mt-7 flex flex-col gap-3">
            <For each={quizzes()}>
              {(item) => {
                return (
                  <li role="button" onClick={() => onClick(item.id)} class={clsx("group rounded-lg hover:bg-primary hover:text-white h-full w-full p-4 transition", selected() === item.id ? "bg-primary" : "bg-list-item")}>
                    <div class="flex gap-2">
                      <div class="bg-slate-200 w-8 h-8 rounded-lg mt-0.5" />
                      <div class="flex flex-col">
                        <div class={clsx(selected() === item.id && "text-white")}>{item.quizName}</div>
                        <p class={clsx(selected() === item.id ? "text-white/70" : "text-light-gray", "group-hover:text-white/70")}>{item.genre}</p>
                      </div>
                    </div>
                    <Show when={item.id === selected()}>
                      <div class="border-t border-gray-200 mt-4 pt-4 text-left flex flex-col gap-4">
                        <p class="text-sm text-white/85">{item.description}</p>
                        <div class="flex items-center gap-3 text-sm">
                          <Show when={Boolean(item.timeLimit)}>
                            <div class="flex items-center gap-1">
                              <p class="text-white">{item.timeLimit}</p>
                              <p class="text-white/60">time</p>
                            </div>
                          </Show>
                          <div class="flex items-center">
                            <p class="text-white font-bold mr-1">Difficulty:</p>
                            <p class="text-white">{item.difficulty}</p>
                          </div>
                        </div>
                        <A href="/play">
                          <Button onClick={onStartQuiz} />
                        </A>
                      </div>
                    </Show>
                  </li>
                )
              }}
            </For>
          </ul>
          <Show when={hasMore()}>
            <div ref={setLoaderRef} class="py-4 flex justify-center items-center">
              {
                data.loading && (
                  <svg class="animate-spin size-6" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" class="stroke-gray-200 stroke-[2.5]" fill="none" />
                    <path d="M12 2a10 10 0 0 1 10 10" class="stroke-primary stroke-[2.5]" stroke-linecap="round" fill="none" />
                  </svg>
                )
              }
            </div>
          </Show>
        </Show>
      </Show>
    </Layout>
  );
}

export default HomeScreen;
