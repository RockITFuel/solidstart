import { RouteSectionProps, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { JSX, Suspense } from "solid-js";
import "./app.css";
import { buttonVariants } from "./components/ui/button";

export default function App() {
  return (
    <Router
      root={(props) => (
        <div class="">
          <div class="flex gap-1">
            <RouteButton href="/" props={props}>
              Index
            </RouteButton>
            <RouteButton href="/posts" props={props}>
              Posts
            </RouteButton>
            <RouteButton href="/login" props={props}>
              Login
            </RouteButton>
          </div>
          <Suspense>{props.children}</Suspense>
        </div>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

export const RouteButton = ({
  href,
  children,
  props,
}: {
  href: string;
  children: JSX.Element;
  props: RouteSectionProps<unknown>;
}) => {
  return (
    <a
      class={buttonVariants({
        variant: props?.location?.pathname === href ? "default" : "outline",
      })}
      href={href}
    >
      {children}
    </a>
  );
};
