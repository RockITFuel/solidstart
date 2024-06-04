import {
  RouteDefinition,
  RouteSectionProps,
  cache,
  createAsync,
  redirect,
} from "@solidjs/router";
import { z } from "zod";
import { getPost } from "~/domain/post/posts.server";
import { getUser } from "~/lib";
import { db } from "~/lib/db";
const schema = z.object({
  postId: z.string().uuid(),
});

// //~ Als je een export doet dan bugged die
// const getPost = cache(async (props: { postId: string }) => {
//   "use server";
//   const res = schema.safeParse(props);
//   if (!res.success) {
//     return redirect("/");
//   }
//   const { postId } = res.data;
//   console.log(" res.data: ", res.data);

//   const user = await getUser();

//   const post = await db.post.findFirstOrThrow({
//     where: {
//       id: postId,
//     },
//     include: { author: true },
//   });
//   console.log("last post: ", post);

//   return { post };
// }, "post");

export const route = {
  load: (r) => {
    (postId: string) => {
      getPost({ postId: postId });
    };
  },
} satisfies RouteDefinition;

export default function ViewPost(props: RouteSectionProps) {
  const post = createAsync(() => getPost({ postId: props.params.postId }), {});
  return (
    <div class="p-5">
      <div class="bg-red-500">View Post: {post()?.post.title}</div>
      <pre>{JSON.stringify(post(), null, 2)}</pre>
    </div>
  );
}
