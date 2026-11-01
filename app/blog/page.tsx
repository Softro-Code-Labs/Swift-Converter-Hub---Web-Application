import { PageHeader } from '@/components/site/PageHeader';
import { PostList } from '@/components/site/MorePosts';
import type { Metadata } from 'next';
import { JsonLd, breadcrumbJsonLd } from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/blog',
  title: 'Blog - Guides to File Formats & Compression',
  description:
    'Plain-language guides to image formats, PDF compression and how browser-based file conversion works, from the team behind Swift Converter Hub.',
});

export default function BlogIndexPage() {
  return (
    <main className="flex-1">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ])}
      />

      <PageHeader
        title="Blog"
        lead="Plain-language write-ups on file formats, compression and how browser-based conversion works."
      />
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <PostList />
      </div>
    </main>
  );
}
