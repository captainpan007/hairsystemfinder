import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps, GetStaticPaths } from 'next';
import fs from 'fs';
import path from 'path';

interface BlogPost {
  city: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  generatedAt: string;
}

interface BlogPageProps {
  post: BlogPost;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const blogDir = path.join(process.cwd(), 'data', 'blog');
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.json'));
  const paths = files.map(f => ({
    params: { slug: f.replace('.json', '') },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<BlogPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const filePath = path.join(process.cwd(), 'data', 'blog', `${slug}.json`);
  const post: BlogPost = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return { props: { post } };
};

export default function BlogPost({ post }: BlogPageProps) {
  const paragraphs = post.content.split('\n\n');

  return (
    <>
      <Head>
        <title>{post.title} | HairSystemFinder</title>
        <meta name="description" content={post.description} />
      </Head>

      <div className="bg-[#1a2332] text-white" style={{ minHeight: 'auto' }}>
        <header className="py-4 px-4 border-b border-gray-700">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-lg font-bold hover:text-blue-400 transition-colors">
              HairSystemFinder
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/blog" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
            &larr; Back to City Guides
          </Link>

          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

          <div className="space-y-4 text-gray-300 leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gray-800 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Find a Specialist in {post.city}</h2>
            <p className="text-gray-400 mb-4">Browse verified hair system salons near you.</p>
            <Link
              href={`/salons/${post.slug}`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              View {post.city} Salons
            </Link>
          </div>
        </main>

        <footer className="py-8 px-4 border-t border-gray-700 text-center text-gray-500 text-sm">
          &copy; 2026 HairSystemFinder
        </footer>
      </div>
    </>
  );
}
