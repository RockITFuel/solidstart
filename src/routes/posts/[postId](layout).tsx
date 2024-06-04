import { RouteSectionProps } from "@solidjs/router";

export default function PostLayout(props: RouteSectionProps) {
  return (
    <div class="p-5">
      <div class="bg-red-500">Layout Post: {props.params.postId}</div>
      {props.children}
    </div>
  );
}
