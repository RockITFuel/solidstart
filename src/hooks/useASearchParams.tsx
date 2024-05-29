import {
  NavigateOptions,
  Params,
  SetParams,
  useSearchParams,
} from "@solidjs/router";
import { Accessor, createMemo } from "solid-js";

export default function useASearchParams<T extends { [key: string]: any }>({
  init,
}: {
  init: (params: Partial<Params>) => T;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Set the initial search params
  setSearchParams(init(searchParams));

  // Create memoized table controls
  const initSafeSearchParams = createMemo(() => {
    return init(searchParams);
  });

  const setSafeSearchParams = (params: Partial<T>) => {
    setSearchParams({
      ...initSafeSearchParams(),
      ...params,
    });
  };

  return [initSafeSearchParams, setSafeSearchParams] as [
    Accessor<T>,
    (params: Partial<T>) => void
  ];
}
