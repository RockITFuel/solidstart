import { getUser } from "../../lib";
import { createPost, type CreatePost } from "./zod";
import { db } from "../../lib/db";
import {
  RouteLoadFuncArgs,
  action,
  cache,
  redirect,
  reload,
  useParams,
} from "@solidjs/router";
import z from "zod";
import { zodValidate } from "~/lib/functions/validate";

export const submitXX = async () => {
  "use server";
  console.log("submitPost");

  const user = await getUser();
  console.log("user: ", user);
};

const schema = z.object({
  page: z.number().min(1),
  limit: z.number(),
  search: z.string(),
});

export const getPosts = cache(
  async (props: { page: number; limit: number; search: string }) => {
    "use server";
    const res = schema.safeParse(props);
    if (!res.success) {
      return redirect("/");
    }
    const { page, limit, search } = res.data;
    console.log(" res.data: ", res.data);

    console.count("getPosts");
    const user = await getUser();

    const posts = await db.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });
    // console.log("last post: ", posts[0]?.title);
    const count = await db.post.count({
      where: {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      },
    });

    return { posts, count };
  },
  "posts"
);
const getPostSchema = z.object({
  postId: z.string().uuid(),
});
export const getPost = cache(async (props: { postId: string }) => {
  "use server";

  const { postId } = zodValidate(getPostSchema, props);
  // console.log(" res.data: ", res.data);

  const user = await getUser();

  const post = await db.post.findFirstOrThrow({
    where: {
      id: postId,
    },
    include: { author: true },
  });
  console.count(`last post: ${post.title} `);

  return { post };
}, "post");

export const submitPost = action(async (data: FormData) => {
  "use server";
  console.log("data: ", data);

  const formData = createPost.parse(data);
  const user = await getUser();

  await db.post.create({
    data: {
      ...formData,
      authorId: user.id,
    },
  });

  console.log("submitPost", data);
  console.log("user: ", user);
  // return reload();
  // return redirect("/");
}, "submitPost");
