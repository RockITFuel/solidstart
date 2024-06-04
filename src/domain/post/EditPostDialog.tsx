import { createForm, reset, setValues, zodForm } from "@modular-forms/solid";
import {
  action,
  cache,
  createAsync,
  redirect,
  useAction,
  useSubmission,
} from "@solidjs/router";
import {
  Show,
  Suspense,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
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
import ActionWrapper from "~/components/ActionWrapper";
import { z } from "zod";
import { zodValidate } from "~/lib/functions/validate";
import { getPost } from "./posts.server";

const editPostSchema = z.object({
  postId: z.string().uuid(),
  title: z.string().min(3),
  content: z.string().min(8),
});

type EditPost = z.infer<typeof editPostSchema>;

export const editPost = action(async (formData: EditPost) => {
  "use server";

  const data = zodValidate(editPostSchema, formData);
  console.log("data: ", data);

  // console.log("data: ", data);
  const user = await getUser();

  try {
    const post = await db.post.update({
      where: {
        id: data.postId,
      },
      data: {
        title: data.title,
        content: data.content,
        authorId: user.id,
      },
    });
    console.log("updated post: ", post);
    // console.count(`post: ${post.title}`);
  } catch (error) {
    console.log("error: ", error);
    return error as Error;
  }

  return redirect("/posts");
}, "addPost$");

export function EditPostDialog(props: { postId: string }) {
  const [open, setOpen] = createSignal(false);

  const [post, { mutate, refetch }] = createResource(
    open,
    () =>
      getPost({ postId: props.postId }).then((data) => {
        setValues(formStore, {
          postId: data?.post.id!,
          title: data?.post.title!,
          content: data?.post.content!,
        });
        return data;
      }),
    {}
  );

  const [formStore, { Form, Field }] = createForm<EditPost>({
    validate: zodForm(createPost),
  });

  return (
    <Suspense>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Edit
      </Button>

      <Dialog open={open()} onOpenChange={setOpen}>
        <DialogContent>
          <ActionWrapper action={editPost}>
            {({ isLoading, action }) => (
              <Form
                onSubmit={(data) => {
                  console.log("data: ", data);
                  data.postId = post()?.post.id!;
                  setOpen(false);
                  action(data);
                }}
              >
                <DialogHeader>
                  <DialogTitle>Edit post {}</DialogTitle>
                  <div class="flex flex-col gap-2 w-full">
                    <input
                      class="hidden"
                      name="postId"
                      value={post()?.post.id}
                    ></input>
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
                    when={isLoading()}
                    fallback={<Button type="submit">Edit</Button>}
                  >
                    <Button type="button">Saving...</Button>
                  </Show>
                </DialogFooter>
              </Form>
            )}
          </ActionWrapper>
        </DialogContent>
      </Dialog>
    </Suspense>
  );
}
