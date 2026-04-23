import { createEffect, createSignal, onCleanup, onMount } from "solid-js";

export function useTimer(initialTime: () => number) {
  const [timeLeft, setTimeLeft] = createSignal(0);
  const [isRunning, setIsRunning] = createSignal(false);

  let interval: number | undefined;

  createEffect(() => {
    setTimeLeft(initialTime());
  });

  const start = () => {
    if (isRunning()) return;
    setIsRunning(true);
    interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          pause();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    setIsRunning(false);
    clearInterval(interval);
  };

  onMount(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        pause();
      } else {
        start();
      }
    };
    const handleFocus = () => start();
    const handleBlur = () => pause();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    if (!document.hidden && document.hasFocus()) {
      start();
    }

    onCleanup(() => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      clearInterval(interval);
    });
  });

  const formatTime = () => {
    const minutes = Math.floor(timeLeft() / 60);
    const seconds = timeLeft() % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return { timeLeft, isRunning, formatTime, start, pause };
}
