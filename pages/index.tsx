import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const POPULAR_CITIES = [
  { name: 'NYC', slug: 'new-york' },
  { name: 'LA', slug: 'los-angeles' },
  { name: 'Houston', slug: 'houston' },
  { name: 'Dallas', slug: 'dallas' },
  { name: 'Chicago', slug: 'chicago' },
];

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const slug = searchQuery.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    router.push(`/salons/${slug}`);
  };

  return (
    <>
      <Head>
        <title>HairSystemFinder — Find Your Hair System Studio</title>
        <meta name="description" content="The first directory dedicated to hair system specialists. Find vetted salons near you." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#1a2332] text-white">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center min-h-[70vh] px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
            Find Your Studio
          </h1>
          <p className="text-lg text-gray-300 mb-8 text-center">
            50 vetted specialists. Wearers only.
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
          </div>
        </section>

        {/* Email Subscribe */}
        <section id="subscribe" className="py-16 px-4 border-t border-gray-700">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-xl font-bold mb-2">Get notified when we add salons in your city</h2>
            <p className="text-gray-400 text-sm mb-6">No spam, just updates.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-l-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-r-lg font-medium transition-colors"
              >
                Notify Me
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-gray-700 text-center text-gray-500 text-sm">
          © 2026 HairSystemFinder. Built by wearers, for wearers.
        </footer>
      </div>
    </>
  );
}
