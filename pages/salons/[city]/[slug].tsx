import { GetStaticProps, GetStaticPaths } from 'next';
import { useState, useEffect } from 'react';
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
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salon.address)}`;

  return (
    <>
      <Head>
        <title>{salon.name} - Hair System Specialist in {salon.city_display} | HairSystemFinder</title>
        <meta name="description" content={`${salon.name} in ${salon.city_display}. Hair system specialist — services, pricing, and contact info.`} />
      </Head>

      <div className="bg-[#1a2332] text-white">
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
          {/* Back link */}
          <Link
            href={`/salons/${salon.city}`}
            className="inline-block text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            &larr; Back to {salon.city_display} salons
          </Link>

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
            <div className="font-semibold text-lg flex items-center gap-2">
              {salon.accepts_outside_systems ? (
                <>
                  <span className="text-green-400">✓ Accepts Outside Hair Systems</span>
                  <span className="relative group cursor-help">
                    <span className="text-gray-400 text-sm">&#9432;</span>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-2 bg-gray-900 text-gray-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      This studio accepts hair systems purchased elsewhere.
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <span className="text-gray-400">Uses In-House Systems Only</span>
                  <span className="relative group cursor-help">
                    <span className="text-gray-500 text-sm">&#9432;</span>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-gray-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      This studio uses its own brand of hair systems and does not work with outside hair pieces you bring in.
                    </span>
                  </span>
                </>
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
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              View on Google Maps
            </a>
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
            <ClaimSection salonName={salon.name} salonId={salon.id} />
          )}

          {/* Reviews */}
          <ReviewSection salonId={salon.id} />
        </main>

        <footer className="py-8 px-4 border-t border-gray-700 text-center text-gray-500 text-sm">
          © 2026 HairSystemFinder
        </footer>
      </div>
    </>
  );
}

function ClaimSection({ salonName, salonId }: { salonName: string; salonId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('claimName') as HTMLInputElement).value,
      email: (form.elements.namedItem('claimEmail') as HTMLInputElement).value,
      phone: (form.elements.namedItem('claimPhone') as HTMLInputElement).value,
      salonName,
      salonId,
    };
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('sent');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="mt-8 p-6 bg-green-900/30 rounded-lg border border-green-700 text-center">
        <p className="text-green-400 font-semibold">Claim request sent! We&apos;ll review and get back to you.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700 text-center">
      <h3 className="text-lg font-semibold mb-2">Own this studio?</h3>
      <p className="text-gray-400 text-sm mb-4">
        Claim your listing to update info, add services, and connect with clients.
      </p>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Claim This Listing
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto text-left space-y-3">
          <input name="claimName" required placeholder="Your name" className="w-full px-3 py-2 bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input name="claimEmail" type="email" required placeholder="Your email" className="w-full px-3 py-2 bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input name="claimPhone" type="tel" placeholder="Phone (optional)" className="w-full px-3 py-2 bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium transition-colors text-sm"
          >
            {status === 'sending' ? 'Sending...' : 'Submit Claim'}
          </button>
          {status === 'error' && <p className="text-red-400 text-sm">Something went wrong. Try again.</p>}
        </form>
      )}
    </div>
  );
}

interface Review {
  id: string;
  visited: boolean;
  accepts_outside: boolean;
  rating: number;
  comment: string;
  created_at: string;
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <span className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`cursor-${onChange ? 'pointer' : 'default'} text-xl select-none ${
            i <= (hover || value) ? 'opacity-100' : 'opacity-30'
          }`}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
        >
          ⭐
        </span>
      ))}
    </span>
  );
}

function ReviewSection({ salonId }: { salonId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [visited, setVisited] = useState(false);
  const [acceptsOutside, setAcceptsOutside] = useState(false);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sent' | 'error'>('idle');

  useEffect(() => {
    fetch(`/api/reviews?salonId=${encodeURIComponent(salonId)}`)
      .then((r) => r.json())
      .then((data) => setReviews(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [salonId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId,
          visited,
          accepts_outside: acceptsOutside,
          rating,
          comment,
        }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews((prev) => [...prev, newReview]);
        setSubmitStatus('sent');
        setShowForm(false);
        setRating(0);
        setVisited(false);
        setAcceptsOutside(false);
        setComment('');
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mt-8 border-t border-gray-700 pt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Community Reviews
          {reviews.length > 0 && (
            <span className="text-gray-400 text-sm font-normal ml-2">
              ({reviews.length} review{reviews.length !== 1 ? 's' : ''} · avg {avgRating} ⭐)
            </span>
          )}
        </h2>
        {!showForm && submitStatus !== 'sent' && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {submitStatus === 'sent' && (
        <div className="mb-4 p-3 bg-green-900/30 rounded-lg border border-green-700 text-green-400 text-sm">
          Thanks for your review!
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Rating *</label>
            <StarRating value={rating} onChange={setRating} />
            {rating === 0 && (
              <span className="text-gray-500 text-xs ml-2">Select a rating</span>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={visited}
                onChange={(e) => setVisited(e.target.checked)}
                className="rounded bg-gray-700 border-gray-600"
              />
              I&apos;ve visited this salon
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptsOutside}
                onChange={(e) => setAcceptsOutside(e.target.checked)}
                className="rounded bg-gray-700 border-gray-600"
              />
              They accepted my outside system
            </label>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Comment (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Share your experience..."
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
            <span className="text-gray-500 text-xs">{comment.length}/500</span>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
          {submitStatus === 'error' && (
            <p className="text-red-400 text-sm">Something went wrong. Try again.</p>
          )}
        </form>
      )}

      {/* Review List */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 text-sm">No reviews yet. Be the first to share your experience!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <StarRating value={review.rating} />
                <span className="text-gray-500 text-xs">{review.created_at}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {review.visited && (
                  <span className="text-xs px-2 py-0.5 bg-blue-900/40 text-blue-300 rounded-full">
                    Visited
                  </span>
                )}
                {review.accepts_outside && (
                  <span className="text-xs px-2 py-0.5 bg-green-900/40 text-green-300 rounded-full">
                    Accepts outside systems
                  </span>
                )}
              </div>
              {review.comment && (
                <p className="text-gray-300 text-sm">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
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
