import { RouteSectionProps } from "@solidjs/router";
import { RouteButton } from "~/components/RouteButton";

export default function GTELayout(props: RouteSectionProps) {
  return (
    <div class="">
      <nav class="flex gap-1">
        <RouteButton href="/gte" props={props}>
          Home
        </RouteButton>
        {/* <RouteButton href="/posts" props={props}>
          Posts
        </RouteButton>
        <RouteButton href="/login" props={props}>
          Login
        </RouteButton> */}
      </nav>

      <h1 class="bg-red-500">GTE Layout</h1>
      {props.children}
    </div>
  );
}
