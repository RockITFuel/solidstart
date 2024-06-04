import { RouteSectionProps } from "@solidjs/router";

export default function BlogLayout(props: RouteSectionProps) {
  return (
    <div class="p-5">
      <div class="bg-green-500">Layout Blog</div>
      {props.children}
    </div>
  );
}
