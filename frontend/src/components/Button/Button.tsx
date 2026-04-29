import clsx from "clsx";
import { JSX, Match, mergeProps, splitProps, Switch } from "solid-js";

type Props = {
  variant?: "default" | "white" | "inverted";
}
export default function Button(props: Props & JSX.ButtonHTMLAttributes<HTMLButtonElement>) {
  const merged = mergeProps({ variant: 'default' }, props);
  const [local, rest] = splitProps(merged, ['variant', 'class', 'disabled']);
  return (
    <Switch>
      <Match when={local.variant === "default"}>
        <button class={clsx("h-12 rounded-xl border-none font-bold text-[15px] cursor-pointer shadow-[0_6px_16px_oklch(0.72_0.18_287/0.27)]", local.class, local.disabled ? "bg-accent/40 text-white/80 pointer-events-none" : "bg-accent hover:bg-accent/90 active:bg-accent text-white")} disabled={local.disabled} {...rest}>
          {merged.children}
        </button>
      </Match>
      <Match when={local.variant === "white"}>
        <button class={clsx("h-12 border border-gray-300 text-gray-500 rounded-xl hover:bg-gray-100 hover:cursor-pointer transition-colors", local.class)} disabled={local.disabled} {...rest}>{merged.children}</button>
      </Match>
      <Match when={local.variant === "inverted"}>
        <button class={clsx("h-12 rounded-xl border-none font-bold text-[15px] cursor-pointer shadow-[0_6px_16px_oklch(0.72_0.18_287/0.27)]", local.class, local.disabled ? "bg-white/40 text-accent/80 pointer-events-none" : "bg-white hover:bg-white/90 active:bg-white text-accent")} disabled={local.disabled} {...rest}>
          {merged.children}
        </button>
      </Match>
    </Switch>
  )
}
