import {
  A,
  RouteSectionProps,
  createAsync,
  useNavigate,
  type RouteDefinition,
} from "@solidjs/router";
import { For, Suspense, createSignal } from "solid-js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { TestForm } from "~/components/TestForm";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { AddPostDialog } from "~/domain/post/AddPostDialog";
import DeletePostDialogV2 from "~/domain/post/DeletePostDialogV2";
import { getPosts } from "~/domain/post/posts.server";
import useASearchParams from "~/hooks/useASearchParams";
import { SearchParams } from "~/lib/types/util";
import { EditPostDialog } from "~/domain/post/EditPostDialog";

const initialSearchParams = (searchParams: SearchParams) => {
  return {
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit) : 10,
    search: searchParams.search ? searchParams.search : "",
  };
};

export const route = {
  load: (r) => {
    getPosts(initialSearchParams(r.params));
  },
} satisfies RouteDefinition;

export default function Posts(props: RouteSectionProps) {
  const [tableControls, setSearchParams] = useASearchParams((searchParams) =>
    initialSearchParams(searchParams)
  );
  const goto = useNavigate();

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
    <div class="w-full p-4 space-y-2">
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
                  <TableCell class="" onClick={() => goto(`${post.id}`)}>
                    {post.title}
                  </TableCell>
                  <TableCell class="">{post.content}</TableCell>
                  <TableCell class="">{post.author.username}</TableCell>

                  <TableCell class="flex gap-1">
                    <DeletePostDialogV2 postId={post.id} />
                    <EditPostDialog postId={post.id} />
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
          disabled={tableControls().page <= 1}
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
    </div>
  );
}
