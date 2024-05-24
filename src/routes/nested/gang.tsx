import { createAsync, type RouteDefinition } from "@solidjs/router";
import { getUser, logout } from "~/lib";

export const route = {
  load: () => getUser()
} satisfies RouteDefinition;

export default function Gang() {
  const user = createAsync(() => getUser(), { deferStream: true });
  return (
    <main class="w-full p-4 space-y-2">
      <h2 class="font-bold text-3xl">Nested gang</h2>
      <h3 class="font-bold text-xl">Message board</h3>
      
    </main>
  );
}