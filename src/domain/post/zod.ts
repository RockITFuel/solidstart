import { z } from "zod";

export const createPost = z.object({
  title: z.string().min(4),
  content: z.string().min(8),
});

export type CreatePost = z.infer<typeof createPost>;
