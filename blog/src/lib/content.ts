import postsIndex from "../generated/posts.json";
import tagsIndex from "../generated/tags.json";
import type { PostDetail, PostListItem, Tag } from "./types";

// Each post body is its own chunk, so the list pages do not download every post.
const postModules = import.meta.glob<{ default: PostDetail }>("../generated/post/*.json");

const allPosts = postsIndex as PostListItem[];

export interface PostQuery {
  tag?: string;
  q?: string;
}

export function listPosts({ tag = "", q = "" }: PostQuery = {}): PostListItem[] {
  const needle = q.trim().toLowerCase();
  return allPosts.filter((post) => {
    if (tag && !post.tags.includes(tag)) return false;
    if (!needle) return true;
    return [post.title, post.excerpt ?? "", ...post.tags].join(" ").toLowerCase().includes(needle);
  });
}

export function listTags(): Tag[] {
  return [...(tagsIndex as Tag[])].sort((a, b) => b.postCount - a.postCount || a.name.localeCompare(b.name));
}

export async function getPost(slug: string): Promise<PostDetail | null> {
  const load = postModules[`../generated/post/${slug}.json`];
  return load ? (await load()).default : null;
}
