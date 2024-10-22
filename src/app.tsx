import { RouteSectionProps } from "@solidjs/router";
import { Router, Route } from "@solidjs/router";

import { FileRoutes } from "@solidjs/start/router";
import { JSX, Suspense } from "solid-js";
import "./app.css";
import { buttonVariants } from "./components/ui/button";
import { Toaster, toast } from "solid-sonner";

import { RouteButton } from "./components/RouteButton";

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
            <RouteButton href="/blogs" props={props}>
              Blogs
            </RouteButton>
            <RouteButton href="/login" props={props}>
              Login
            </RouteButton>
          </div>
          <Suspense>{props.children}</Suspense>
          <Toaster />
        </div>
      )}
    >
      {/* <Route path="/gte" component={GTELayout}>
        <Route path="/" component={Posts} />
      </Route>
      <Route path="/posts" component={PostsLayout}>
        <Route path="/" component={Posts} />
      </Route> */}
      <FileRoutes />
    </Router>
  );
}
