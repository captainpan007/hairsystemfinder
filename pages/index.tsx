import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const POPULAR_CITIES = [
  { name: 'New York', slug: 'new-york' },
  { name: 'Los Angeles', slug: 'los-angeles' },
  { name: 'Houston', slug: 'houston' },
  { name: 'Dallas', slug: 'dallas' },
  { name: 'Chicago', slug: 'chicago' },
];

const CITY_ALIASES: Record<string, string> = {
  'nyc': 'new-york',
  'ny': 'new-york',
  'la': 'los-angeles',
};

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    let slug = searchQuery.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    slug = CITY_ALIASES[slug] || slug;
    router.push(`/salons/${slug}`);
  };

  return (
    <>
      <Head>
        <title>Find Hair System Specialists Near You | HairSystemFinder</title>
        <meta name="description" content="The first directory dedicated to hair system specialists. Find vetted salons for hair replacement, maintenance, and styling near you." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://hairsystemfinder.com" />
      </Head>

      <div className="bg-[#1a2332] text-white">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center py-24 px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
            Find Your Studio
          </h1>
          <p className="text-lg text-gray-300 mb-8 text-center">
            52 vetted specialists. Wearers only.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="w-full max-w-md mb-6">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter city or zip code..."
                className="flex-1 px-4 py-3 rounded-l-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-r-lg font-medium transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Sub CTAs */}
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="#cities" className="hover:text-white transition-colors underline">
              Browse All
            </a>
            <span>·</span>
            <a href="#subscribe" className="hover:text-white transition-colors underline">
              Add Your Studio
            </a>
            <span>·</span>
            <a href="/blog" className="hover:text-white transition-colors underline">
              City Guides
            </a>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-4 border-t border-gray-700">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">1</div>
                <h3 className="font-semibold text-lg mb-1">Search</h3>
                <p className="text-gray-400 text-sm">Enter your city or zip code</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">2</div>
                <h3 className="font-semibold text-lg mb-1">Find</h3>
                <p className="text-gray-400 text-sm">Browse vetted specialists near you</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">3</div>
                <h3 className="font-semibold text-lg mb-1">Book</h3>
                <p className="text-gray-400 text-sm">Call or book directly with the studio</p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Cities */}
        <section id="cities" className="py-16 px-4 border-t border-gray-700">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-8">Popular Cities</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {POPULAR_CITIES.map((city) => (
                <a
                  key={city.slug}
                  href={`/salons/${city.slug}`}
                  className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors text-sm"
                >
                  {city.name}
                </a>
              ))}
            </div>
            <a href="/blog" className="mt-6 inline-block text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Read our city guides &rarr;
            </a>
          </div>
        </section>

        {/* Email Subscribe */}
        <section id="subscribe" className="py-16 px-4 border-t border-gray-700">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-xl font-bold mb-2">Get notified when we add salons in your city</h2>
            <p className="text-gray-400 text-sm mb-6">No spam, just updates.</p>
            {subStatus === 'done' ? (
              <p className="text-green-400 font-medium">You&apos;re subscribed!</p>
            ) : (
              <form
                className="flex"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!subEmail) return;
                  setSubStatus('sending');
                  try {
                    const res = await fetch('/api/subscribe', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: subEmail }),
                    });
                    setSubStatus(res.ok ? 'done' : 'error');
                  } catch {
                    setSubStatus('error');
                  }
                }}
              >
                <input
                  type="email"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-l-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={subStatus === 'sending'}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-r-lg font-medium transition-colors"
                >
                  {subStatus === 'sending' ? '...' : 'Notify Me'}
                </button>
              </form>
            )}
            {subStatus === 'error' && <p className="text-red-400 text-sm mt-2">Something went wrong. Try again.</p>}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-gray-700 text-center text-gray-500 text-sm">
          <div className="flex justify-center gap-2 mb-2">
            <a href="#cities" className="hover:text-gray-300 transition-colors underline">Browse All</a>
            <span>·</span>
            <a href="/blog" className="hover:text-gray-300 transition-colors underline">City Guides</a>
            <span>·</span>
            <a href="#subscribe" className="hover:text-gray-300 transition-colors underline">Add Your Studio</a>
            <span>·</span>
            <a href="mailto:hello@hairsystemfinder.com" className="hover:text-gray-300 transition-colors underline">Contact</a>
          </div>
          <p className="mb-2">For business inquiries: <a href="mailto:hello@hairsystemfinder.com" className="text-gray-300 hover:text-white underline">hello@hairsystemfinder.com</a></p>
          © 2026 HairSystemFinder. Built by wearers, for wearers.
        </footer>
      </div>
    </>
  );
}
