import { createEffect, createResource, createSignal, For, Show } from 'solid-js';
import { PlayLayout } from '../components/layout';
import { getLetters } from '../api';
import clsx from 'clsx';
import { Button } from '../components/Button';
import z from 'zod';

const AnswerSchema = z.object({
  answer: z.string().min(1),
});

function PlayScreen() {
  const [data] = createResource(getLetters);
  const [currentLetter, setCurrentLetter] = createSignal(0);
  const [answer, setAnswer] = createSignal("");
  const [error, setError] = createSignal(true);

  let debounceTimer: number | undefined;

  createEffect(() => {
    if (data()) {
      const letter = data()?.[0];
      if (letter?.id) {
        setCurrentLetter(letter.id);
      }
    }
  })

  const selectedLetter = () => data()?.find(l => l.id === currentLetter())?.letter ?? "";

  const handleInput = (e: InputEvent) => {
    const value = (e.currentTarget as HTMLInputElement).value;
    setAnswer(value);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const result = AnswerSchema.safeParse({ answer: value });
      setError(!result.success);
    }, 300);
  }

  return (
    <PlayLayout timeLimit={180}>
      <Show when={data()}>
        <div class="grid grid-cols-10 gap-2 place-items-center px-4 pb-4">
          <For each={data()}>
            {item => {
              return (
                <button class={clsx("size-6 rounded-md bg-gray-200 text-gray-600 hover:bg-secondary hover:text-white font-semibold leading-none cursor-pointer", currentLetter() === item.id && "bg-secondary text-white size-7")}>{item.letter.toUpperCase()}</button>
              )
            }}
          </For>
        </div>
      </Show>
      <div class="bg-white flex flex-col gap-4 items-center p-4">
        <div class="flex flex-col items-center gap-4">
          <div class="size-14 rounded-2xl flex items-center justify-center bg-secondary/20 border-2 border-secondary text-secondary text-2xl font-bold">{selectedLetter().toUpperCase()}</div>
          <p class="text-sm text-gray-700">Question 7 of 26</p>
        </div>
        <div class="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p class="font-medium">What force pulls objects toward Earth's center and keeps planets in orbit?</p>
          <div class="flex gap-1 bg-secondary/10 text-secondary rounded-lg text-sm p-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
              <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
              <path fill-rule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clip-rule="evenodd" />
            </svg>
            <span>Newton figured this out watching an apple fall.</span>
          </div>
        </div>
        <div class="w-full">
          <form>
            <div class="flex items-center px-2 border-2 border-gray-200 rounded-lg w-full h-10 text-gray-400 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20 focus-within:text-secondary transition-colors">
              <span class="font-bold text-sm border-r border-gray-200 px-2 mr-2">{selectedLetter().toUpperCase()}</span>
              <input class="appearance-none w-full h-full outline-none ring-0 text-black" type="text" value={answer()} onInput={handleInput} />
            </div>
            <div class="mt-2 grid grid-cols-4 gap-2">
              <Button disabled={error()} class="col-span-3">Submit</Button>
              <Button variant="white" class="flex items-center justify-center gap-1">
                <span>Skip</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                  <path fill-rule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PlayLayout>
  );
}

export default PlayScreen;
