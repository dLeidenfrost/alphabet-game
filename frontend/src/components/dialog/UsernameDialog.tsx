import { Dialog } from "@kobalte/core/dialog";
import { Input } from "../input";
import { Button } from "../Button";
import { createEffect, createSignal } from "solid-js";

type Props = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (username: string) => void;
}
export default function UsernameDialog(props: Props) {
  const [value, setValue] = createSignal("");

  createEffect(() => {
    if (!props.open) {
      setValue("");
    }
  })

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 bg-black/50" />
        <Dialog.Content class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg min-w-90">
          <div class="flex items-center gap-2">
            <div class="size-10 rounded-xl shrink-0 bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center text-white font-bold text-base">
              Az
            </div>
            <div class="flex flex-col gap-1">
              <Dialog.Title class="text-lg font-bold leading-none">What's your name?</Dialog.Title>
              <Dialog.Description class="text-sm text-gray-500 leading-none">We will show it on your score</Dialog.Description>
            </div>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              props.onConfirm(value());
            }}
          >
            <div class="my-4">
              <Input placeholder="Your name" value={value()} onChange={e => setValue(e.target.value)} />
            </div>
            <div class="flex items-center gap-2">
              <Button
                class="grow"
                type="submit"
              >
                Let's go
              </Button>
              <Dialog.CloseButton as="div">
                <Button type="button" variant="white" class="w-24">
                  Cancel
                </Button>
              </Dialog.CloseButton>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
