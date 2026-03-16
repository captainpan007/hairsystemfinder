import Head from 'next/head';
import Link from 'next/link';

const CITIES = [
    { name: 'New York', slug: 'new-york' },
    { name: 'Los Angeles', slug: 'los-angeles' },
    { name: 'Chicago', slug: 'chicago' },
    { name: 'Houston', slug: 'houston' },
    { name: 'Phoenix', slug: 'phoenix' },
    { name: 'Philadelphia', slug: 'philadelphia' },
    { name: 'San Antonio', slug: 'san-antonio' },
    { name: 'San Diego', slug: 'san-diego' },
    { name: 'Dallas', slug: 'dallas' },
    { name: 'Miami', slug: 'miami' },
];

export default function BlogIndex() {
  return (
    <>
      <Head>
        <title>Hair System Guides by City | HairSystemFinder</title>
        <meta name="description" content="City-by-city guides to finding the best hair system salons. Pricing, tips, and specialist directories." />
      </Head>

      <div className="bg-[#1a2332] text-white">
        <header className="py-4 px-4 border-b border-gray-700">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-lg font-bold hover:text-blue-400 transition-colors">
              HairSystemFinder
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">City Guides</h1>
          <p className="text-gray-400 mb-8">Everything you need to know about hair system salons in your city.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/blog/${city.slug}`}
                className="block bg-gray-800 rounded-lg p-5 hover:ring-1 hover:ring-blue-400 transition-all"
              >
                <h2 className="text-lg font-semibold mb-1">{city.name}</h2>
                <p className="text-gray-400 text-sm">Hair system guide &rarr;</p>
              </Link>
            ))}
          </div>
        </main>

        <footer className="py-8 px-4 border-t border-gray-700 text-center text-gray-500 text-sm">
          &copy; 2026 HairSystemFinder
        </footer>
      </div>
    </>
  );
}
