import { action, redirect, reload } from "@solidjs/router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { createPost } from "~/lib/post/zod";
import { db } from "~/lib/db";
import { getUser } from "~/lib";
import { getPosts } from "~/lib/post/posts.server";

function formDataToObject(formData: FormData): { [key: string]: any } {
  const obj: { [key: string]: any } = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

const createPost$ = action(async (formData: FormData) => {
  "use server";
  console.log("formData: ", formData.get("title"));
  formData.set("content", "admin x xx x  x x x x x x x x x x x ");

  const data = createPost.safeParse(Object.fromEntries(formData.entries()));
  if (data.success === false) {
    console.log("error: ", data.error.errors);
    return redirect("/posts");
  }

  const user = await getUser();

  try {
    const post = await db.post.create({
      data: {
        ...data.data,
        authorId: user.id,
      },
    });
    console.log("post: ", post);
  } catch (error) {
    console.log("error: ", error);
    return error as Error;
  }
  // throw reload({
  //   revalidate: getPosts.key,
  // });
  // return redirect(`/notes/${id}`);
  return redirect("/posts");
}, "createPost$");

export function TestForm() {
  return (
    <form action={createPost$} method="post">
      <label for="title">Title:</label>
      <Input type="text" name="title" />

      <Button type="submit">submit</Button>
    </form>
  );
}
