import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import salonsData from '@/data/salons.json';

interface Salon {
  id: string;
  name: string;
  slug: string;
  city: string;
  city_display: string;
  state: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  website: string;
  booking_url: string;
  hours: string;
  price_range: string;
  services: string[];
  accepts_outside_systems: boolean;
  system_types: string[];
  private_room: boolean;
  claimed: boolean;
  verified: boolean;
  google_place_id: string;
  google_rating: number;
  google_reviews_count: number;
  description: string;
  created_at: string;
}

interface SalonPageProps {
  salon: Salon;
}

const SERVICE_LABELS: Record<string, string> = {
  'full-attach': 'Full Attach',
  'cut-in': 'Cut-In',
  'maintenance': 'Maintenance',
};

const SYSTEM_LABELS: Record<string, string> = {
  lace: 'Lace',
  skin: 'Skin',
  mono: 'Mono',
};

export default function SalonPage({ salon }: SalonPageProps) {
  const mapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(salon.address)}`;

  return (
    <>
      <Head>
        <title>{salon.name} — {salon.city_display} | HairSystemFinder</title>
        <meta name="description" content={`${salon.name} in ${salon.city_display}. Hair system specialist — services, pricing, and contact info.`} />
      </Head>

      <div className="min-h-screen bg-[#1a2332] text-white">
        {/* Header */}
        <header className="py-4 px-4 border-b border-gray-700">
          <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/salons/${salon.city}`} className="hover:text-white transition-colors">
              {salon.city_display}
            </Link>
            <span>/</span>
            <span className="text-white">{salon.name}</span>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8">
          {/* Name + Rating */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">{salon.name}</h1>
              <p className="text-gray-400">{salon.address}</p>
            </div>
            <div className="text-right">
              {salon.google_rating > 0 && (
                <div className="text-yellow-400 text-lg font-semibold">
                  ★ {salon.google_rating}
                </div>
              )}
              {salon.google_reviews_count > 0 && (
                <div className="text-gray-400 text-sm">
                  {salon.google_reviews_count} reviews
                </div>
              )}
              {salon.claimed && (
                <span className="inline-block mt-1 px-2 py-1 bg-green-900 text-green-300 rounded text-xs">
                  Claimed
                </span>
              )}
            </div>
          </div>

          {/* 1. Accepts Outside Systems — most important */}
          <div className={`p-4 rounded-lg mb-6 ${salon.accepts_outside_systems ? 'bg-green-900/30 border border-green-700' : 'bg-gray-800 border border-gray-700'}`}>
            <div className="font-semibold text-lg">
              {salon.accepts_outside_systems ? (
                <span className="text-green-400">✓ Accepts Outside Hair Systems</span>
              ) : (
                <span className="text-gray-400">Uses In-House Systems Only</span>
              )}
            </div>
          </div>

          {/* 2. Services */}
          {salon.services.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Services</h2>
              <div className="flex flex-wrap gap-2">
                {salon.services.map((s) => (
                  <span key={s} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                    {SERVICE_LABELS[s] || s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 3. Contact */}
          <div className="mb-6 flex flex-wrap gap-3">
            {salon.phone && (
              <a
                href={`tel:${salon.phone}`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Call {salon.phone}
              </a>
            )}
            {salon.booking_url && (
              <a
                href={salon.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Book Online
              </a>
            )}
            {salon.website && (
              <a
                href={salon.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Website
              </a>
            )}
          </div>

          {/* 4. Map */}
          <div className="mb-6">
            <iframe
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: '0.5rem' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={mapsEmbedUrl}
            />
          </div>

          {/* 5. Price Range */}
          {salon.price_range && (
            <div className="mb-4">
              <h2 className="text-sm font-medium text-gray-400 mb-1 uppercase tracking-wide">Price Range</h2>
              <p className="text-lg">{salon.price_range}</p>
            </div>
          )}

          {/* 6. Hours */}
          {salon.hours && (
            <div className="mb-4">
              <h2 className="text-sm font-medium text-gray-400 mb-1 uppercase tracking-wide">Hours</h2>
              <p>{salon.hours}</p>
            </div>
          )}

          {/* 7. System Types */}
          {salon.system_types.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">System Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {salon.system_types.map((t) => (
                  <span key={t} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                    {SYSTEM_LABELS[t] || t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 8. Private Room */}
          {salon.private_room && (
            <div className="mb-4">
              <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">Private Room Available</span>
            </div>
          )}

          {/* 9. Description */}
          {salon.description && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-400 mb-1 uppercase tracking-wide">About</h2>
              <p className="text-gray-300">{salon.description}</p>
            </div>
          )}

          {/* Claim CTA */}
          {!salon.claimed && (
            <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700 text-center">
              <h3 className="text-lg font-semibold mb-2">Own this studio?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Claim your listing to update info, add services, and connect with clients.
              </p>
              <a
                href={`mailto:hello@hairsystemfinder.com?subject=Claim: ${encodeURIComponent(salon.name)}&body=I'd like to claim the listing for ${encodeURIComponent(salon.name)} at ${encodeURIComponent(salon.address)}.`}
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Claim This Listing
              </a>
            </div>
          )}
        </main>

        <footer className="py-8 px-4 border-t border-gray-700 text-center text-gray-500 text-sm">
          © 2026 HairSystemFinder
        </footer>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = (salonsData as Salon[]).map((s) => ({
    params: { city: s.city, slug: s.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const city = params?.city as string;
  const slug = params?.slug as string;

  const salon = (salonsData as Salon[]).find(
    (s) => s.city === city && s.slug === slug
  );

  if (!salon) {
    return { notFound: true };
  }

  return {
    props: { salon },
  };
};
