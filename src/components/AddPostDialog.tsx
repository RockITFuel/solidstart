import { action, redirect, reload, revalidate } from "@solidjs/router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CreatePost, createPost } from "~/lib/post/zod";
import { db } from "~/lib/db";
import { getUser } from "~/lib";
import { Show, createSignal } from "solid-js";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { createForm, zodForm } from "@modular-forms/solid";
import { Label } from "./ui/label";
import { get } from "http";
import { getPosts } from "~/lib/post/posts.server";



const addPost = action(async (formData: FormData) => {
  "use server";
  console.log("formData: ", formData.get("title"));

  const data = createPost.safeParse(Object.fromEntries(formData.entries()));
  if (data.success === false) {
    console.log("error: ", data.error.errors);
    return redirect("/posts");
  }

  console.log("data: ", data);
  const user = await getUser();
  console.log("user: ", user, {
    ...data.data,
    authorId: user.id,
  });
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
  }


  revalidate(getPosts.key);
  throw reload();
}, "addPost");

export function AddPostDialog() {
  const [open, setOpen] = createSignal(false);
  const [loginForm, { Form, Field }] = createForm<CreatePost>({
    initialValues: {
      title: "test",
      content: "this is a test content with a minimum of 8 characters.",
    },
    validate: zodForm(createPost),
  });

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button onclick={() => setOpen((prev) => !prev)} variant="outline">
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form
          action={addPost}
          method="post"
          onSubmit={(data) => {
            setOpen(false);
            console.log("client data", data);
            // submitPost(data);
          }}
        >
          <DialogHeader>
            <DialogTitle>Add a post</DialogTitle>
            <div class="flex flex-col gap-2 w-full">
              <Field name="title">
                {(field, props) => (
                  <div class="grid w-full items-center gap-1.5">
                    <Label for="email">Title</Label>
                    <Input
                      {...props}
                      type="text"
                      value={field.value}
                      required
                    />
                    <Show when={field.error}>
                      <div class="text-red-500">{field.error}</div>
                    </Show>
                  </div>
                )}
              </Field>
              <Field name="content">
                {(field, props) => (
                  <div class="grid w-full items-center gap-1.5">
                    <Label for="email">Content</Label>
                    <Input
                      {...props}
                      type="text"
                      value={field.value}
                      required
                    />
                    <Show when={field.error}>
                      <div class="text-red-500">{field.error}</div>
                    </Show>
                  </div>
                )}
              </Field>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
