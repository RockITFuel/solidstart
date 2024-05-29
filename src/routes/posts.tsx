import {
  RouteSectionProps,
  action,
  createAsync,
  redirect,
  useAction,
  useSearchParams,
  type RouteDefinition,
} from "@solidjs/router";
import { For, Show, Suspense, createMemo, createSignal } from "solid-js";
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
  DialogCloseButton,
} from "~/components/ui/dialog";
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

// export const getPosts = cache(async () => {
//   "use server";
//   // const user = await getUser();

//   // const posts = await db.post.findMany({
//   //   orderBy: { createdAt: "desc" },
//   //   include: { author: true },
//   // });

//   // return posts;
// }, "posts");

import { AddPostDialog } from "~/components/AddPostDialog";
import { TestForm } from "~/components/TestForm";
import { SuperFormDialog } from "~/components/SuperFormDialog";
import { getPosts } from "~/lib/post/posts.server";
import { Checkbox } from "~/components/ui/checkbox";
import { Button, buttonVariants } from "~/components/ui/button";
import { getUser } from "~/lib";
import { db } from "~/lib/db";
import ActionButton from "~/components/ActionButton";
import DeletePostDialog from "~/components/domain/post/DeletePostDialog";
import { count } from "console";
import useASearchParams from "~/hooks/useASearchParams";
import DeletePostDialogV2 from "~/components/domain/post/DeletePostDialogV2";

export const route = {
  load: (r) => {
    const searchParams = r.params;
    getPosts({
      page: searchParams.page ? parseInt(searchParams.page) : 1,
      limit: searchParams.limit ? parseInt(searchParams.limit) : 10,
      search: searchParams.search ? searchParams.search : "",
    });
  },
} satisfies RouteDefinition;

export default function Posts(props: RouteSectionProps) {
  console.log("  props.params: ", props.params);

  const [tableControls, setSearchParams] = useASearchParams({
    init: (searchParams) => {
      return {
        page: searchParams.page ? parseInt(searchParams.page) : 1,
        limit: searchParams.limit ? parseInt(searchParams.limit) : 10,
        search: searchParams.search ? searchParams.search : "",
      };
    },
  });

  const posts = createAsync(() => getPosts(tableControls()), {
    initialValue: {
      posts: [],
      count: 0,
    },
    deferStream: true,
  });
  const [open, setOpen] = createSignal(false);
  const [value, setValue] = createSignal("");

  return (
    <main class="w-full p-4 space-y-2">
      <div class="flex justify-between">
        <TestForm />
        <h2 class="font-bold text-3xl">Blogs</h2>
        <AddPostDialog />
        {/* <SuperFormDialog /> */}
      </div>
      <div class="flex gap-1">
        <input
          class="border rounded-md p-1"
          type="text"
          oninput={(e) => setValue(e.target.value)}
          value={value()}
        />
        <div class="">{value()}</div>
      </div>
      <div class="flex gap-1">
        <Checkbox checked={open()} onChange={(e) => setOpen(e)} />

        <div class="">{JSON.stringify(open())}</div>
      </div>
      <pre>{JSON.stringify(posts().posts?.[0], null, 2)}</pre>

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
              each={posts().posts}
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

                  <TableCell class="">
                    <DeletePostDialogV2 postId={post.id} />
                    {/* <DeletePostDialog postId={post.id} /> */}
                  </TableCell>
                </TableRow>
              )}
            </For>
          </Suspense>
        </TableBody>
      </Table>
      <div class="p-2 flex gap-2">
        <Button
          variant="secondary"
          disabled={tableControls().page <= 0}
          onClick={() => {
            setSearchParams({ page: tableControls().page - 1 });
          }}
        >
          Vorige
        </Button>
        <div class="border rounded-md px-4 py-2">{tableControls().page}</div>

        <Button
          variant="secondary"
          disabled={
            (tableControls().page + 1) * tableControls().limit >= posts().count
          }
          onClick={() => {
            setSearchParams({ page: tableControls().page + 1 });
          }}
        >
          Volgende
        </Button>
      </div>
    </main>
  );
}
