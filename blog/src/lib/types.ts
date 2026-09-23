export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  heroImageUrl: string | null;
  publishedAt: string | null;
  tags: string[];
}

export interface PostDetail extends PostListItem {
  content: string;
  status: string;
}