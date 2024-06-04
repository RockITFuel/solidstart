import { RouteSectionProps } from "@solidjs/router";

export default function BlogsLayout(props: RouteSectionProps) {
  return (
    <div class="p-5">
      <div class="bg-red-500">Layout Blogs</div>
      {props.children}
    </div>
  );
}
