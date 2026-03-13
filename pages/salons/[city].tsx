import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import salonsData from '@/data/salons.json';

interface Salon {
  id: string;
  name: string;
  slug: string;
  city: string;
  city_display: string;
  state: string;
  address: string;
  phone: string;
  services: string[];
  accepts_outside_systems: boolean;
  price_range: string;
  google_rating: number;
  google_reviews_count: number;
}

interface CityPageProps {
  city: string;
  cityDisplay: string;
  salons: Salon[];
}

const SERVICE_LABELS: Record<string, string> = {
  'full-attach': 'Full Attach',
  'cut-in': 'Cut-In',
  'maintenance': 'Maintenance',
};

export default function CityPage({ city, cityDisplay, salons }: CityPageProps) {
  const [serviceFilter, setServiceFilter] = useState('');
  const [outsideFilter, setOutsideFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  const filtered = salons.filter((s) => {
    if (serviceFilter && !s.services.includes(serviceFilter)) return false;
    if (outsideFilter === 'yes' && !s.accepts_outside_systems) return false;
    if (outsideFilter === 'no' && s.accepts_outside_systems) return false;
    if (priceFilter && s.price_range !== priceFilter) return false;
    return true;
  });

  return (
    <>
      <Head>
        <title>Hair System Salons in {cityDisplay} | HairSystemFinder</title>
        <meta name="description" content={`Find hair system specialists in ${cityDisplay}. Browse vetted salons with ratings and contact info.`} />
      </Head>

      <div className="min-h-screen bg-[#1a2332] text-white">
        {/* Header */}
        <header className="py-4 px-4 border-b border-gray-700">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-lg font-bold hover:text-blue-400 transition-colors">
              HairSystemFinder
            </Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">
            Hair System Salons in {cityDisplay}
          </h1>
          <p className="text-gray-400 mb-8">{filtered.length} studios found</p>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Services</option>
              <option value="full-attach">Full Attach</option>
              <option value="cut-in">Cut-In</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <select
              value={outsideFilter}
              onChange={(e) => setOutsideFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Outside Systems</option>
              <option value="yes">Accepts Outside</option>
              <option value="no">In-House Only</option>
            </select>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Any Price</option>
              <option value="$50-100">$50-100</option>
              <option value="$100-200">$100-200</option>
              <option value="$200+">$200+</option>
            </select>
          </div>

          {/* Salon Cards */}
          {filtered.length === 0 ? (
            <p className="text-gray-400">No salons match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((salon) => (
                <Link
                  key={salon.id}
                  href={`/salons/${city}/${salon.slug}`}
                  className="block bg-gray-800 rounded-lg p-5 hover:bg-gray-750 hover:ring-1 hover:ring-blue-400 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold">{salon.name}</h2>
                    {salon.google_rating > 0 && (
                      <span className="text-yellow-400 text-sm font-medium">
                        ★ {salon.google_rating} ({salon.google_reviews_count})
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{salon.address}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {salon.services.map((s) => (
                      <span key={s} className="px-2 py-1 bg-gray-700 rounded text-xs">
                        {SERVICE_LABELS[s] || s}
                      </span>
                    ))}
                    {salon.accepts_outside_systems && (
                      <span className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs">
                        Accepts Outside Systems
                      </span>
                    )}
                  </div>
                  {salon.phone && (
                    <p className="text-blue-400 text-sm">{salon.phone}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const cities = [...new Set((salonsData as Salon[]).map((s) => s.city))];
  const paths = cities.map((city) => ({ params: { city } }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const city = params?.city as string;
  const salons = (salonsData as Salon[]).filter((s) => s.city === city);

  if (salons.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      city,
      cityDisplay: salons[0].city_display,
      salons,
    },
  };
};
