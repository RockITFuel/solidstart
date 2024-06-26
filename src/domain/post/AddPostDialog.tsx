import { createForm, zodForm } from "@modular-forms/solid";
import { action, redirect, useAction, useSubmission } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { getUser } from "~/lib";
import { db } from "~/lib/db";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { CreatePost, createPost } from "./zod";

export const addPost = action(async (formData: CreatePost) => {
  "use server";

  const data = createPost.safeParse(formData);
  if (data.success === false) {
    console.log("error: ", data.error.errors);
    return data.error.errors;
  }

  console.log("data: ", data);
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

  return redirect("/posts");
}, "addPost$");

export function AddPostDialog() {
  const [open, setOpen] = createSignal(false);
  const isSaving = useSubmission(addPost);
  const submitPost = useAction(addPost);

  const [loginForm, { Form, Field }] = createForm<CreatePost>({
    initialValues: {
      title: "",
      content: "this is a test content with a minimum of 8 characters.",
    },
    validate: zodForm(createPost),
  });

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Add
      </Button>

      <Dialog open={open()} onOpenChange={setOpen}>
        <DialogContent>
          <Form
            onSubmit={(data) => {
              setOpen(false);
              submitPost(data);
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
              <DialogCloseButton>
                <Button variant="outline">Cancel</Button>
              </DialogCloseButton>
              <Show
                when={isSaving.result}
                fallback={<Button type="submit">Add</Button>}
              >
                <Button type="button">Saving...</Button>
              </Show>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
