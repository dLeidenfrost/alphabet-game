import { createEffect, createResource, createSignal, ErrorBoundary, For, Show } from "solid-js";
import { getLetters, getQuestionsWithAnswers, QuestionAnswer } from "../api";
import { getGameSessionQuestions } from "../db/operations";
import clsx from "clsx";
import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { Button } from "../components/Button";

function FinishScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams?.s ? parseInt(searchParams.s.toString()) : 0;
  const [lettersData] = createResource(getLetters);
  const [questionsData] = createResource(() => ({ sessionId, isAnswered: false }), (params) => getGameSessionQuestions(params.sessionId, params.isAnswered));
  const [selected, setSelected] = createSignal<QuestionAnswer | undefined>();
  const quizId = searchParams?.id ? parseInt(searchParams.id.toString()) : 0;

  const questionIds = () => questionsData()?.map(question => question.questionId);
  const [questionWithAnswers] = createResource(() => {
    const ids = questionIds();
    return ids && quizId && ids.length > 0 ? { quizId, questionIds: ids.join(',') } : null;
  }, (params) => getQuestionsWithAnswers(params.quizId, params.questionIds));

  const wrongLetterIds = () => new Set(questionWithAnswers()?.map(q => q.letterId) ?? []);
  const correctLettersLength = () => (lettersData()?.length ?? 0) - wrongLetterIds().size;

  createEffect(() => {
    if (questionWithAnswers?.error?.message) {
      navigate("/", { replace: true });
    }
  })

  createEffect(() => {
    if (!searchParams?.id || !searchParams?.s) {
      navigate("/", { replace: true });
    }
  })

  const selectedLetter = () => lettersData()?.find(l => l?.id === selected()?.letterId);
  const didWonTheGame = () => wrongLetterIds().size <= 0;

  return (
    <Show when={!lettersData.loading && !questionsData.loading && !questionWithAnswers.loading}>
      <ErrorBoundary fallback={<div>Error</div>}>
        <div class="bg-white max-w-sm mx-auto py-6 px-5 text-center">
          {
            didWonTheGame() ? (
              <div class="size-[100px] rounded-full bg-gradient-to-br from-[oklch(0.92_0.06_145)] to-[oklch(0.82_0.12_145)] mx-auto mt-4 mb-5 flex items-center justify-center shadow-[0_10px_24px_oklch(0.48_0.12_130/0.2)]">
                <svg width="40" height="40" viewBox="0 0 24 24" >
                  <path d="M5 12l4 4 10-10" stroke="#3b6d11" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            ) : (
              <div class="size-[100px] rounded-full bg-gradient-to-br from-error-from to-error-to mx-auto mt-4 mb-5 flex items-center justify-center shadow-[0_10px_24px_oklch(0.35_0.12_25/0.2)]">
                <svg width="40" height="40" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" class="stroke-red-dark" stroke-width="2.5" fill="none" />
                  <path d="M12 7v6M12 16v.5" class="stroke-red-dark" stroke-width="2.5" stroke-linecap="round" />
                </svg>
              </div>
            )
          }
          <h2 class="font-bold text-[1.75rem]">{didWonTheGame() ? "Amazing" : "Time is up"}</h2>
          <p class="text-[0.9375rem] text-light-gray">{didWonTheGame() ? `You completed all ${lettersData()?.length ?? 0} questions with` : "You ran out of time, but you made great progress"}</p>
          <div class="py-5 px-6 bg-list-item rounded-2xl mt-4">
            <h2 class="text-accent font-bold text-[2.75rem]">{correctLettersLength()}/{lettersData()?.length ?? 0}</h2>
          </div>
          <Show when={!didWonTheGame()}>
            <div class="py-5 px-6 bg-list-item rounded-2xl mt-4">
              <p class="uppercase text-[0.6875rem] text-light-gray font-semibold text-left mb-3">Tap a missed letter to review</p>
              <div class="grid grid-cols-12 gap-2">
                <For each={lettersData()}>
                  {(item) => (
                    <button
                      class={
                        clsx(
                          "rounded-sm flex items-center justify-center w-5 h-5 uppercase text-[0.6875rem] font-bold outline-0",
                          wrongLetterIds().has(item.id) ? "bg-[oklch(0.97_0.03_85)] text-error border border-[oklch(0.88_0.08_70)] hover:cursor-pointer hover:opacity-80 active:bg-red-100" : "text-green-dark bg-grid-item opacity-30",
                          item.id === selected()?.letterId && "bg-accent text-white border-2 border-accent-dark",
                        )
                      }
                      onClick={() => {
                        const answer = questionWithAnswers()?.find(q => q?.letterId === item.id);
                        if (answer) {
                          setSelected(answer);
                        }
                      }}
                    >
                      {item.letter}
                    </button>
                  )}
                </For>
              </div>
              <Show when={Boolean(selected())}>
                <hr class="mt-2 mb-4 border-gray-200" />
                <div class="text-left flex flex-col gap-4">
                  <div class="flex items-center justify-between">
                    <Show when={selectedLetter()?.id}>
                      <p class="text-[0.6875rem] font-semibold uppercase text-light-gray">Letter {selectedLetter()?.letter}</p>
                    </Show>
                    <button class="text-light-gray hover:opacity-70 hover:cursor-pointer w-4 h-4 flex items-center justify-center" onClick={() => {
                      setSelected(undefined);
                    }}>×</button>
                  </div>
                  <p class="text-[0.875rem]">{selected()?.question}</p>
                  <div class="flex items-center gap-2">
                    <span class="font-semibold uppercase text-[0.6875rem] text-light-gray">Answer</span>
                    <span class="text-accent font-bold text-xl">{selected()?.answer}</span>
                  </div>
                </div>
              </Show>
            </div>
          </Show>
          <div class="flex flex-col gap-2 py-8">
            <A href="/">
              <Button class="w-full" variant="white">Choose another quiz</Button>
            </A>
          </div>
        </div>
      </ErrorBoundary>
    </Show>
  );
}

export default FinishScreen;
