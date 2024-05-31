import { Action, action, redirect, useSubmission } from "@solidjs/router";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import ActionButton from "~/components/ActionButton";
import { Button, buttonVariants } from "~/components/ui/button";
import { getUser } from "~/lib";
import { db } from "~/lib/db";
import { toast } from "solid-sonner";
import { Show } from "solid-js";
import ActionWrapper from "~/components/ActionWrapper";
import { z } from "zod";
import { zodValidate } from "~/lib/functions/validate";

const schema = z.object({
  id: z.string(),
});

type Schema = z.infer<typeof schema>;

const deletePost = action(async (props: Schema) => {
  "use server";
  //! Guard
  const user = await getUser();
  //! Validate
  const data = zodValidate(schema, props);

  const deletedPost = await db.post.delete({
    where: {
      id: data.id,
    },
  });

  if (!deletePost) {
    return new Error("Post not found");
  }

  console.log("deleted post: ", deletedPost);

  return redirect("/posts", {
    statusText: "Post deleted successfully",
    status: 200,
  });
});

export default function DeletePostDialogV2({ postId }: { postId: string }) {
  return (
    <ActionWrapper
      action={deletePost}
      onError={(e) => {
        toast.error(`${e?.message}`);
      }}
      onSuccess={() => {
        toast.success("Post deleted successfully");
      }}
    >
      {({ isLoading, action }) => (
        <Dialog>
          <DialogTrigger>
            <div
              class={buttonVariants({
                variant: "destructive",
                class: [isLoading() && "animate-pulse"],
              })}
            >
              <Show when={isLoading()} fallback={<>Delete</>}>
                Deleting...
              </Show>
            </div>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogCloseButton>
                <Button variant="ghost">Cancel</Button>
                <Button variant="default" onclick={() => action({id: postId})}>
                  Proceed
                </Button>
              </DialogCloseButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ActionWrapper>
  );
}
