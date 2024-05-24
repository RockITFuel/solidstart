import { cache, createAsync, type RouteDefinition } from "@solidjs/router";
import { For, Show, Suspense, createResource, createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import { getSome, getUser, loginOrRegister, logout } from "~/lib";
import { db } from "~/lib/db";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

// export const getPosts = cache(async () => {
//   "use server";
//   // const user = await getUser();

//   // const posts = await db.post.findMany({
//   //   orderBy: { createdAt: "desc" },
//   //   include: { author: true },
//   // });

//   // return posts;
// }, "posts");

import { createForm, zodForm } from "@modular-forms/solid";
import { Label } from "~/components/ui/label";
import { z } from "zod";
import { comment } from "postcss";
import { CreatePost, createPost } from "~/lib/post/zod";
import { getPosts, submitPost } from "~/lib/post/posts.server";
import { TestForm } from "~/components/TestForm";
import { AddPostDialog } from "~/components/AddPostDialog";

type LoginForm = {
  email: string;
  password: string;
};

export const route = {
  load: () => getPosts(),
} satisfies RouteDefinition;

export default function Posts() {
  // const [posts, { mutate, refetch }] = createResource(() => getPosts(), {
  //   deferStream: true,
  // });
  const posts = createAsync(() => getPosts());
  const [open, setOpen] = createSignal(false);

  return (
    <main class="w-full p-4 space-y-2">
      <div class="flex justify-between">
        <TestForm />
        <h2 class="font-bold text-3xl">Blogs</h2>
        <AddPostDialog />
      </div>

      <pre>{JSON.stringify(posts()?.[0], null, 2)}</pre>

      <Table>
        <TableCaption>A list of your recent blogs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[100px]">Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Author</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Suspense
            fallback={
              <TableRow>
                <TableCell colSpan="5">Loading...</TableCell>
              </TableRow>
            }
          >
            <For
              each={posts()}
              fallback={
                <TableRow>
                  <TableCell colSpan="5">No data</TableCell>
                </TableRow>
              }
            >
              {(post) => (
                <TableRow>
                  <TableCell class="">{post.title}</TableCell>
                  <TableCell class="">{post.content}</TableCell>
                  <TableCell class="">{post.author.username}</TableCell>
                  <TableCell class=""></TableCell>
                </TableRow>
              )}
            </For>
          </Suspense>
        </TableBody>
      </Table>
    </main>
  );
}
