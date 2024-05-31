import { Accessor, createSignal, JSX } from "solid-js";
import { Action, useAction } from "@solidjs/router";

type Props<T extends any[], U> = {
  action: Action<T, U>;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
  children: (props: {
    isLoading: Accessor<boolean>;
    action: (...args: Parameters<Action<T, U>>) => Promise<void>;
  }) => JSX.Element;
};

export default function ActionWrapper<T extends any[], U>(props: Props<T, U>) {
  const handleAction = useAction(props.action);
  const [isLoading, setIsLoading] = createSignal(false);

  const action = async (...args: Parameters<Action<T, U>>) => {
    setIsLoading(true);
    try {
      await handleAction(...args);
      //! Deze kan soms af gaan als er een error op de server voorkomt die niet geserilized kan worden. BV zod.parse()
      props.onSuccess?.();
    } catch (error) {
      console.error("error: ", error);
      if (error instanceof Error) {
        props.onError?.(error);
      }
    }
    setIsLoading(false);
  };
  return props.children({ isLoading, action });
}

