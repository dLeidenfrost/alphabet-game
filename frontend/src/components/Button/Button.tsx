import { JSX, Match, mergeProps, splitProps, Switch } from "solid-js";

type Props = {
  variant?: "default" | "white";
}
export default function Button(props: Props & JSX.ButtonHTMLAttributes<HTMLButtonElement>) {
  const merged = mergeProps({ variant: 'default' }, props);
  const [local, ...rest] = splitProps(merged, ['variant']);
  return (
    <Switch>
      <Match when={local.variant === "default"}>
        <button class="h-11 w-full rounded-lg bg-secondary text-white hover:bg-secondary/60 hover:cursor-pointer transition" {...rest}>Start quiz</button>
      </Match>
      <Match when={local.variant === "white"}>
        <button class="h-11 w-full rounded-lg bg-secondary text-white hover:bg-secondary/60 hover:cursor-pointer transition" {...rest}>Start quiz</button>
      </Match>
    </Switch>
  )
}
