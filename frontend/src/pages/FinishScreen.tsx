import { createResource, createSignal, For, Show } from "solid-js";
import { getLetters, getQuestionsWithAnswers } from "../api";
import { getGameSessionQuestions } from "../db/operations";
import { getSession } from "../helpers/cookies";
import clsx from "clsx";

function FinishScreen() {
  const session = getSession();
  const sessionId = session?.sessionId ? parseInt(session.sessionId) : 0;
  const [lettersData] = createResource(getLetters);
  const [questionsData] = createResource(() => ({ sessionId, isAnswered: false }), (params) => getGameSessionQuestions(params.sessionId, params.isAnswered));
  const [selected, setSelected] = createSignal();

  const questionIds = () => questionsData()?.map(question => question.questionId);
  const [questionWithAnswers] = createResource(() => {
    const ids = questionIds();
    return ids ? { quizId: 2, questionIds: ids.join(',') } : null;
  }, (params) => {
    return getQuestionsWithAnswers(params.quizId, params.questionIds);
  });

  const wrongLetterIds = () => new Set(questionWithAnswers()?.map(q => q.letterId) ?? []);

  return (
    <div class="bg-white max-w-sm mx-auto py-6 px-5 text-center">
      <div class="size-[100px] rounded-full bg-gradient-to-br from-error-from to-error-to mx-auto mt-4 mb-5 flex items-center justify-center shadow-[0_10px_24px_oklch(0.35_0.12_25/0.2)]">
        <svg width="40" height="40" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" class="stroke-red-dark" stroke-width="2.5" fill="none" />
          <path d="M12 7v6M12 16v.5" class="stroke-red-dark" stroke-width="2.5" stroke-linecap="round" />
        </svg>
      </div>
      <h2 class="font-bold text-[1.75rem]">Time is up</h2>
      <p class="text-[0.9375rem] text-light-gray">You ran out of time, but you made great progress</p>
      <div class="py-5 px-6 bg-list-item rounded-2xl mt-4">
        <h2 class="text-accent font-bold text-[2.75rem]">18/26</h2>
      </div>
      <div class="py-5 px-6 bg-list-item rounded-2xl mt-4">
        <p class="uppercase text-[0.6875rem] text-light-gray font-semibold text-left mb-3">Tap a missed letter to review</p>
        <div class="grid grid-cols-12 gap-2">
          <Show when={!lettersData.loading && !questionsData.loading}>
            <For each={lettersData()}>
              {(item) => (
                <button
                  class={
                    clsx(
                      "rounded-sm flex items-center justify-center w-5 h-5 uppercase text-[0.6875rem] font-bold outline-0",
                      wrongLetterIds().has(item.id) ? "bg-[oklch(0.97_0.03_85)] text-error border border-[oklch(0.88_0.08_70)] hover:cursor-pointer hover:opacity-80 active:bg-red-100" : "text-green-dark bg-grid-item opacity-30",
                      item.id === selected() && "bg-accent text-white border-2 border-accent-dark",
                    )
                  }
                  onClick={() => {
                    setSelected(item.id);
                  }}
                >
                  {item.letter}
                </button>
              )}
            </For>
          </Show>
        </div>
        <Show when={Boolean(selected())}>
          <hr class="mt-2 mb-4 border-gray-200" />
          <div class="text-left flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <p class="text-[0.6875rem] font-semibold uppercase text-light-gray">Letter K</p>
              <button class="text-light-gray hover:opacity-70 hover:cursor-pointer w-4 h-4 flex items-center justify-center" onClick={() => {
                setSelected(0);
              }}>×</button>
            </div>
            <p class="text-[0.875rem]">The SI unit of temperature where 0 equals absolute zero.</p>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default FinishScreen;
