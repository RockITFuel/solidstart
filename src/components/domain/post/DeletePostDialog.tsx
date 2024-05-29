import { action, redirect, useSubmission } from "@solidjs/router";
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

const deletePost = action(async (id: string) => {
  "use server";
  // add 2 seconds delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // Also functions like a guard
  const user = await getUser();
  const deletedPost = await db.post.delete({
    where: {
      id,
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

const advancedPost = action(
  async (props: {
    id: string;
    name: string;
    description: string;
    content: string;
  }) => {
    "use server";

    return redirect("/posts", {
      statusText: "Post deleted successfully",
      status: 200,
    });
  }
);

export default function DeletePostDialog({ postId }: { postId: string }) {
  const handleAction = useSubmission(deletePost);

  return (
    <Dialog>
      <DialogTrigger>
        <div
          class={buttonVariants({
            variant: "destructive",
            class: [handleAction.pending && "animate-pulse"],
          })}
        >
          <Show when={handleAction.pending} fallback={<>Delete</>}>
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
            <ActionButton
              action={deletePost}
              loadingIndicator={true}
              actionArg={[postId]}
              variant={"destructive"}
              onError={(e) => {
                toast.error(`${e?.message}`);
              }}
              onSucces={() => {
                toast.success("Post deleted successfully");
              }}
            >
              Delete
            </ActionButton>
            <ActionButton
              action={advancedPost}
              actionArg={[
                {
                  id: postId,
                  name: "Test",
                  description: "Test",
                  content: "Test",
                },
              ]}
              variant={"default"}
              onError={(e) => {
                toast.error(`${e?.message}`);
              }}
              onSucces={() => {
                toast.success("Post deleted successfully");
              }}
            >
              Advanced
            </ActionButton>
          </DialogCloseButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
