'use client';

import { useState, useEffect } from 'react';
import { GooglePlaceDetails, GoogleReview, getStarRating, formatRelativeTime, truncateReview } from '@/lib/google-reviews';

interface GoogleReviewsProps {
  maxReviews?: number;
  showOverallRating?: boolean;
  className?: string;
}

export default function GoogleReviews({ 
  maxReviews = 6, 
  showOverallRating = true, 
  className = '' 
}: GoogleReviewsProps) {
  const [reviewsData, setReviewsData] = useState<GooglePlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/google-reviews');
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      setReviewsData(data);
    } catch (err) {
      setError('Kunde inte ladda recensioner');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`py-12 ${className}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Laddar recensioner...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !reviewsData) {
    return (
      <div className={`py-12 ${className}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">Recensioner kunde inte laddas just nu.</p>
          </div>
        </div>
      </div>
    );
  }

  const displayedReviews = showAll ? reviewsData.reviews : reviewsData.reviews.slice(0, maxReviews);

  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Vad våra kunder säger
          </h2>
          
          {/* Overall Rating */}
          {showOverallRating && (
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex items-center">
                <span className="text-4xl text-yellow-400 mr-2">
                  {getStarRating(reviewsData.rating)}
                </span>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">
                    {reviewsData.rating.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {reviewsData.user_ratings_total} recensioner
                  </div>
                </div>
              </div>
              <div className="border-l border-gray-300 pl-4">
                <a
                  href={reviewsData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Se alla recensioner
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayedReviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>

        {/* Show More Button */}
        {reviewsData.reviews.length > maxReviews && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {showAll ? 'Visa färre' : `Visa alla ${reviewsData.reviews.length} recensioner`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = review.text.length > 150;
  const displayText = expanded || !shouldTruncate ? review.text : truncateReview(review.text);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Reviewer Info */}
      <div className="flex items-center mb-4">
        <img
          src={review.profile_photo_url}
          alt={review.author_name}
          className="w-12 h-12 rounded-full mr-4"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/api/placeholder/48/48';
          }}
        />
        <div>
          <h4 className="font-semibold text-gray-900">{review.author_name}</h4>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-2">
              {getStarRating(review.rating)}
            </span>
            <span className="text-sm text-gray-600">
              {formatRelativeTime(review.relative_time_description)}
            </span>
          </div>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 leading-relaxed">
        {displayText}
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            {expanded ? 'Visa mindre' : 'Läs mer'}
          </button>
        )}
      </p>
    </div>
  );
}
