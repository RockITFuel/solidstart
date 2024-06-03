import { RouteSectionProps } from "@solidjs/router";
import { JSX } from "solid-js";
import { buttonVariants } from "./ui/button";

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
