import { RouteSectionProps } from "@solidjs/router";

export default function PostLayout(props: RouteSectionProps) {
  console.log("trigged post layout");
  return (
    <div class="p-5">
      <div class="bg-red-500">Layout Posts</div>
      {props.children}
    </div>
  );
}
