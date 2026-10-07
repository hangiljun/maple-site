interface PinnedNotice {
  isPinned?: boolean;
  createdAt?: { toDate: () => Date };
}

export function selectPinnedNotices<T extends PinnedNotice>(notices: T[]): T[] {
  return notices
    .filter(notice => notice.isPinned === true)
    .sort((a, b) => (b.createdAt?.toDate().getTime() || 0) - (a.createdAt?.toDate().getTime() || 0))
    .slice(0, 3);
}

export function getNoticeThumbnail(notice: { imageUrl?: string; content?: string; content_raw?: string }): string | null {
  if (notice.imageUrl) return notice.imageUrl;
  const content = notice.content_raw || notice.content || '';
  const htmlImage = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  const markdownImage = content.match(/!\[[^\]]*\]\(([^\s)]+)(?:\s+[^)]*)?\)/);
  return htmlImage?.[1] || markdownImage?.[1] || null;
}
