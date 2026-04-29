import { JSX } from "solid-js";

export default function Input(props: JSX.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div class="flex items-center px-2 border-2 border-gray-200 rounded-lg w-full h-10 text-gray-400 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20 focus-within:text-secondary transition-colors">
      <input class="appearance-none w-full h-full outline-none ring-0 text-black" type="text" {...props} />
    </div>
  )
}
