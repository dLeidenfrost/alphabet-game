import { createEffect, createResource, createSignal, ErrorBoundary, For, onCleanup, Show, Suspense } from 'solid-js';
import { getQuizzes, Quiz } from '../api';
import clsx from 'clsx';
import { Button } from '../components/Button';
import { Layout } from '../components/layout';
import { UsernameDialog } from '../components/dialog';
import { createGameSession, createUser, getIsQuizCompleted } from '../db/operations';
import { getSession, setSession } from '../helpers/cookies';
import { A, useNavigate } from '@solidjs/router';

const QuizCompleted = (props: { quizId: number, onClick: (quizId: number) => void }) => {
  const [completed] = createResource(() => props.quizId ?? null, (quizId) => getIsQuizCompleted(quizId));
  return (
    <Show when={!completed.loading}>
      <Show when={Boolean(completed())}>
        <A href={`/finish?id=${props.quizId}&s=${completed()}`}>
          <button class="flex items-center gap-2 rounded-xl px-4 h-12 text-white hover:cursor-pointer hover:bg-accent/80">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <span>Completed</span>
          </button>
        </A>
      </Show>
      <Show when={!completed()}>
        <Button
          type="button"
          variant="inverted"
          onClick={() => {
            props.onClick(props.quizId);
          }}
        >
          Start Quiz
        </Button>
      </Show>
    </Show>
  )
}

function HomeScreen() {
  const [page, setPage] = createSignal(1);
  const [data] = createResource(() => ({ rowsPerPage: 8, page: page() }), getQuizzes);
  const [selected, setSelected] = createSignal(0);
  const [quizzes, setQuizzes] = createSignal<Quiz[]>([]);
  const [total, setTotal] = createSignal(0);
  const [open, setOpen] = createSignal(false);

  const navigate = useNavigate();

  let currentQuizId: number | undefined;

  function onClick(id: number) {
    if (id != null) {
      setSelected(id);
    }
  }

  async function onPlay(userId: string, username: string, quizId: number) {
    const sessionId = await createGameSession({
      userId: parseInt(userId),
      quizId,
    });
    setSession(userId, sessionId.toString(), username);
    const query = new URLSearchParams();
    query.set("id", quizId.toString());
    navigate(`/play?${query}`);
  }

  async function onStartQuiz(id: number) {
    const session = getSession();
    if (session?.userId && session?.username) {
      onPlay(session.userId, session.username, id);
      return;
    }
    currentQuizId = id;
    setOpen(true);
  }

  createEffect(() => {
    if (data()) {
      setQuizzes(prev => [...prev, ...data()?.data ?? []]);
      setTotal(data()?.total ?? 0);
    }
  });

  const hasMore = () => quizzes().length < total();

  const setLoaderRef = (el: HTMLDivElement) => {
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting && !data.loading && hasMore()) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 0.5 });

    if (observer) {
      observer.observe(el);
    }

    onCleanup(() => observer?.disconnect());
  }

  const onCreateUser = async (username: string) => {
    try {
      const userId = await createUser(username);
      if (userId && currentQuizId) {
        onPlay(userId.toString(), username, currentQuizId);
      }
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <ErrorBoundary fallback={<div>Error</div>}>
      <Layout>
        <div class="flex flex-col gap-2">
          <h2 class="text-2xl text-center text-dark font-bold">Test your knowledge</h2>
          <h4 class="text-[15px] text-center text-light-gray">Answer one question for each letter of the alphabet before time runs out!</h4>
        </div>
        <Show when={!data.loading || quizzes().length > 0} fallback={<p>Loading...</p>}>
          <Show when={!data.error} fallback={<p>Error {data.error.message}</p>}>
            <ul class="mt-7 flex flex-col gap-3">
              <For each={quizzes()}>
                {(item) => {
                  return (
                    <li role="button" onClick={() => onClick(item.id)} class={clsx("group rounded-xl from-gradient-start to-gradient-end hover:bg-gradient-to-br hover:text-white h-full w-full p-4 transition", selected() === item.id ? "bg-gradient-to-br shadow-[0_10px_24px_oklch(0.72_0.18_287/0.27)]" : "bg-list-item")}>
                      <div class="flex items-center gap-2">
                        <div class="bg-slate-200 w-11 h-11 rounded-lg" />
                        <div class="flex flex-col">
                          <div class={clsx("font-semibold text-[15px]", selected() === item.id ? "text-white" : "text-dark group-hover:text-white")}>{item.quizName}</div>
                          <p class={clsx("text-[13px]", selected() === item.id ? "text-white/70" : "text-light-gray", "group-hover:text-white/70")}>{item.genre}</p>
                        </div>
                      </div>
                      <Show when={item.id === selected()}>
                        <div class="mt-1 pt-4 text-left flex flex-col gap-4">
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
                          <Suspense fallback={<div>Loading...</div>}>
                            <QuizCompleted quizId={item.id} onClick={onStartQuiz} />
                          </Suspense>
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
        <UsernameDialog
          open={open()}
          onConfirm={username => {
            onCreateUser(username);
          }}
          onOpenChange={isOpen => {
            setOpen(isOpen);
          }}
        />
      </Layout>
    </ErrorBoundary>
  );
}

export default HomeScreen;
