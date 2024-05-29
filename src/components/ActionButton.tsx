import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  Show,
  splitProps,
  ValidComponent,
} from "solid-js";
import * as ButtonPrimitive from "@kobalte/core/button";
import { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { LoaderCircle } from "lucide-solid";

import { cn } from "~/lib/utils";
import { Action, useAction, useSubmission } from "@solidjs/router";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps<T extends Array<any>, U> = ButtonPrimitive.ButtonRootProps &
  VariantProps<typeof buttonVariants> & {
    class?: string | undefined;
    children?: JSX.Element | ((isLoading: Accessor<boolean>) => JSX.Element);
    action: Action<T, U>;
    loadingIndicator?: boolean;
    actionArg: Parameters<Action<T, U>>;
    onClick?: (actionPromise: Promise<void>) => void;
    onError?: (error: Error) => void;
    onSucces?: () => void;
  };

const ActionButton = <
  T extends ValidComponent = "button",
  A extends Array<any> = [],
  R = void
>(
  props: PolymorphicProps<T, ButtonProps<A, R>>
) => {
  const [local, others] = splitProps(props as ButtonProps<A, R>, [
    "variant",
    "size",
    "class",
    "action",
    "onClick",
    "children",
    "onError",
    "onSucces",
    "actionArg",
    "onClick",
    "loadingIndicator",
  ]);
  const handleAction = useAction(local.action);
  const [isLoading, setIsLoading] = createSignal(false);

  createEffect(() => {
    console.log("isLoading: ", isLoading());
  });
  return (
    <ButtonPrimitive.Root
      class={cn(
        buttonVariants({ variant: local.variant, size: local.size }),
        local.class
      )}
      onClick={() => {
        setIsLoading(true);
        const promise = handleAction(...local.actionArg)
          .then((e) => {
            if (e instanceof Error) {
              return local.onError?.(e);
            } else {
              local.onSucces?.();
            }
          })
          .finally(() => {
            console.log("finally");
            setIsLoading(false);
          });
        local.onClick?.(promise);
      }}
      {...others}
      children={
    typeof local.children === "function" ? (
      local.children(isLoading)
    ) : (
      <>
        <Show when={local.loadingIndicator} fallback={local.children}>
          <div class="">
            <Show when={isLoading()}>
              <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
            </Show>
            <Show when={local.size !== "icon"}>
              <span>{local.children}</span>
            </Show>
          </div>
        </Show>
      </>
    )
  }
    />
  );
};

export default ActionButton;
// children={
//     typeof local.children === "function" ? (
//       local.children(isLoading)
//     ) : (
//       <>
//         <Show when={local.loadingIndicator} fallback={local.children}>
//           <div class="">
//             <Show when={isLoading()}>
//               <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
//             </Show>
//             <Show when={local.size !== "icon"}>
//               <span>{local.children}</span>
//             </Show>
//           </div>
//         </Show>
//       </>
//     )
//   }
