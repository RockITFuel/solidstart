import { action, redirect, reload } from "@solidjs/router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { db } from "~/lib/db";
import { getUser } from "~/lib";
import { createPost } from "~/domain/post/zod";
import ActionWrapper from "./ActionWrapper";
import { toast } from "solid-sonner";
import { zodValidate } from "~/lib/functions/validate";



const createPostFn = action(async (formData: FormData) => {
  "use server";
  console.log("formData: ", formData.get("title"));
  formData.set("content", "admin x xx x  x x x x x x x x x x x ");
  // throw new Error("Post not found");
  // try {
  //   const data = createPost.parse(Object.fromEntries(formData.entries()));
  // } catch (error) {
  //   console.log("error: ", error);
  //   throw new Error("Post not foundxx");
  // }
  // throw new Error("Post not found");

  const data = zodValidate(createPost, formData);
  // if (data.success === false) {
  //   console.log("error: ", data.error.errors);
  //   throw new Error(data.error.errors.join());
  // }

  const user = await getUser();

  try {
    const post = await db.post.create({
      data: {
        ...data,
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
    <ActionWrapper
      action={createPostFn}
      onError={(e) => {
        console.log("error: ", e);
        toast.error(`${e}`);
      }}
      onSuccess={() => {
        console.log("success");
        toast.success("Post created successfully");
      }}
    >
      {({ isLoading, action }) => (
        <form
          onsubmit={(e) => {
            e.preventDefault();
            action(new FormData(e.currentTarget));
          }}
        >
          <label for="title">Title:</label>
          <Input type="text" name="title" />

          <Button type="submit">submit</Button>
        </form>
      )}
    </ActionWrapper>
  );
}
