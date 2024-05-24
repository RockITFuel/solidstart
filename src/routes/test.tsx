import { cache, useSubmission, type RouteSectionProps } from "@solidjs/router";
import { Show, createResource } from "solid-js";
import { loginOrRegister } from "~/lib";

const serverFunction = async () => {
  "use server";
  console.log("Hello");
};

const serverFunctionMutation = async ({ name }: { name: string }) => {
  "use server";
  console.log(`Hello ${name}}`);
};

const loadServerFunction = cache(async () => {
  "use server";
  console.log("fetch loadServerFunction");
  return {
    name: "Kody",
  };
}, "loadServerFunction");

export const route = {
  load: () => loadServerFunction(),
};

export default function Test(props: RouteSectionProps) {
  const [data, { mutate, refetch }] = createResource(() =>
    loadServerFunction()
  );

//   const [data, { mutate, refetch }] = createResource(() => serverFunctionMutation);

  mutate();
  return (
    <main>
      <pre>{JSON.stringify(data(), null, 2)}</pre>
      <button onclick={() => serverFunction()}>server function</button>
    </main>
  );
}
