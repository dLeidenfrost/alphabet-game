import clsx from "clsx";
import { JSX, Match, mergeProps, splitProps, Switch } from "solid-js";

type Props = {
  variant?: "default" | "white";
}
export default function Button(props: Props & JSX.ButtonHTMLAttributes<HTMLButtonElement>) {
  const merged = mergeProps({ variant: 'default' }, props);
  const [local, rest] = splitProps(merged, ['variant', 'class', 'disabled']);
  return (
    <Switch>
      <Match when={local.variant === "default"}>
        <button class={clsx("h-11 w-full rounded-lg hover:bg-secondary/60 hover:cursor-pointer transition", local.class, local.disabled ? "bg-gray-100 text-gray-400 pointer-events-none" : "bg-secondary text-white")} disabled={local.disabled} {...rest}>{merged.children}</button>
      </Match>
      <Match when={local.variant === "white"}>
        <button class={clsx("h-11 w-full rounded-lg bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-100/60 hover:cursor-pointer transition", local.class)} disabled={local.disabled} {...rest}>{merged.children}</button>
      </Match>
    </Switch>
  )
}
