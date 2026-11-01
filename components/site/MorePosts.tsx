import Link from 'next/link';
import { BLOG_POSTS } from '@/config/blog';

export function formatPostDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** List of posts. On an article page, pass `current` to list the others. */
export function PostList({
  current,
  heading,
}: {
  current?: string;
  heading?: string;
}) {
  const posts = BLOG_POSTS.filter((p) => p.slug !== current);
  if (!posts.length) return null;
  return (
    <section aria-label={heading ?? 'Articles'}>
      {heading && (
        <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          {heading}
        </h2>
      )}
      <ul className="divide-y divide-slate-200 dark:divide-slate-800">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={post.path} className="group block py-6">
              <p className="text-[13px] text-slate-500 dark:text-slate-400">
                {post.category} guide, {post.readTime}
              </p>
              <h3 className="mt-1.5 font-display text-xl font-bold leading-snug text-slate-900 group-hover:text-blue-700 sm:text-2xl dark:text-white dark:group-hover:text-blue-300">
                {post.title}
              </h3>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                {post.excerpt}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
