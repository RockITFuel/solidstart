import { Button } from "@kobalte/core/button";
import { A, RouteSectionProps } from "@solidjs/router";
import { buttonVariants } from "~/components/ui/button";

export default function Blogs(props: RouteSectionProps) {
  return (
    <div class="flex flex-col gap-2">
      <div class="">Blogs page</div>
      <A href="1" class={buttonVariants()}>
        Goto Blog 1
      </A>
    </div>
  );
}
