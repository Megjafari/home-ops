export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("sv-SE");
}

/** True when the post was edited on a later calendar day than the day it was published. */
export function wasUpdatedAfterPublish(publishedAt: string | null, updatedAt: string | undefined) {
  if (!publishedAt || !updatedAt) return false;
  return formatDate(updatedAt) > formatDate(publishedAt);
}
