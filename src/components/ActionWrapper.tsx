import {
  Accessor,
  createSignal,
  JSX
} from "solid-js";

import { Action, useAction } from "@solidjs/router";

type Props<T extends any[], U> = {
  action: Action<T, U>;
  onError?: (error: Error) => void;
  onSucces?: () => void;
  children: (props: {
    isLoading: Accessor<boolean>;
    action: (...args: Parameters<Action<T, U>>) => Promise<void>
  }) => JSX.Element;
}

export default function ActionWrapper<T extends any[], U>(props: Props<T, U>) {
  const handleAction = useAction(props.action);
  const [isLoading, setIsLoading] = createSignal(false);

  const action = (...args: Parameters<Action<T, U>>) => {
    setIsLoading(true);
   return handleAction(...args)
      .then((e) => {
        if (e instanceof Error) {
          return props.onError?.(e);
        } else {
          console.log("e: ", e);
          props.onSucces?.();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return props.children({ isLoading, action });
}
