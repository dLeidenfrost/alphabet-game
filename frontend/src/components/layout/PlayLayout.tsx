import { JSX, mergeProps } from "solid-js";
import { useTimer } from "../../helpers/timer";
import clsx from "clsx";
import { A } from "@solidjs/router";

interface LayoutProps {
  children: JSX.Element;
  timeLimit?: number;
}

export function PlayLayout(props: LayoutProps) {
  const merged = mergeProps({ timeLimit: 0 }, props);
  const { formatTime, timeLeft } = useTimer(() => merged.timeLimit);

  return (
    <div class="bg-gray-100 max-w-sm mx-auto">
      <header class="bg-white border-b border-gray-200 bg-white">
        <div class="flex items-center p-5">
          <A href="/">
            <button class="flex items-center gap-1 hover:cursor-pointer text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              <span class="text-sm">Leave</span>
            </button>
          </A>
          <div class="flex ml-auto">
            <div class="flex items-center gap-1 text-xs">
              <span class="text-green-500 font-semibold">6</span>
              <span>correct</span>
              <span class="text-gray-600">·</span>
            </div>
            <div class="flex items-center gap-1 text-xs ml-1">
              <span class="text-red-500 font-semibold">1</span>
              <span>wrong</span>
            </div>
            <span class="mx-2 text-gray-400 h-1/2">|</span>
            <div class="text-gray-400 font-semibold w-9">
              {formatTime()}
            </div>
          </div>
        </div>
        <div class="h-1 bg-gray-200 w-full">
          <div class={clsx('bg-green-400 h-full origin-left transition-transform duration-1000 ease-linear')} style={{ transform: `scaleX(${timeLeft() / merged.timeLimit})` }} />
        </div>
      </header>
      <main class="pt-4">
        {props.children}
      </main>
    </div>
  )
}
