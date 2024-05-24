"use server";

import { getUser } from "..";
import { createPost, type CreatePost } from "./zod";
import { db } from "../db";
import { action, cache, redirect, reload } from "@solidjs/router";

export const submitXX = async () => {
  "use server";
  console.log("submitPost");

  const user = await getUser();
  console.log("user: ", user);
};
export const getPosts = cache(async () => {
  "use server";
  console.count("getPosts");
  const user = await getUser();

  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });
  console.log("last post: ", posts[0].title);

  return posts;
}, "posts");

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
