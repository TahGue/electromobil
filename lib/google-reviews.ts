/**
 * Google Reviews Service
 * Fetches and manages Google Business reviews using Google Places API
 */

export interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: GoogleReview[];
  url: string;
}

/**
 * Fetch Google Reviews using Places API
 */
export async function fetchGoogleReviews(placeId: string): Promise<GooglePlaceDetails | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.error('Google Places API key not found');
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,url&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.result) {
      return {
        place_id: placeId,
        name: data.result.name,
        rating: data.result.rating,
        user_ratings_total: data.result.user_ratings_total,
        reviews: data.result.reviews || [],
        url: data.result.url
      };
    } else {
      console.error('Google Places API error:', data.status, data.error_message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return null;
  }
}

/**
 * Get star rating display (★★★★☆)
 */
export function getStarRating(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '☆' : '') + 
         '☆'.repeat(emptyStars);
}

/**
 * Format relative time in Swedish
 */
export function formatRelativeTime(relativeTime: string): string {
  const timeMap: Record<string, string> = {
    'a day ago': 'för en dag sedan',
    'a week ago': 'för en vecka sedan',
    'a month ago': 'för en månad sedan',
    'a year ago': 'för ett år sedan',
    'days ago': 'dagar sedan',
    'weeks ago': 'veckor sedan',
    'months ago': 'månader sedan',
    'years ago': 'år sedan'
  };

  let swedishTime = relativeTime;
  Object.entries(timeMap).forEach(([english, swedish]) => {
    swedishTime = swedishTime.replace(english, swedish);
  });

  return swedishTime;
}

/**
 * Truncate review text to specified length
 */
export function truncateReview(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
}
