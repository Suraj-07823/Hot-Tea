// Netlify function: fetch, sanitize, and cache Google Place reviews
// Requires environment variables: GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID

let cache = { ts: 0, data: null };
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function getFetch(){
  if (typeof fetch !== 'undefined') return fetch;
  // dynamic import for older Node runtimes
  const { default: nodeFetch } = await import('node-fetch');
  return nodeFetch;
}

function sanitizeText(text){
  if (!text) return '';
  // Remove URLs
  text = text.replace(/https?:\/\/\S+/gi, '');
  // Remove simple phone patterns
  text = text.replace(/\+?\d[\d\-\s]{6,}\d/g, '');
  // Strip HTML tags
  text = text.replace(/<[^>]*>/g, '');
  // Collapse whitespace and trim
  text = text.replace(/\s{2,}/g, ' ').trim();
  // Truncate to 400 chars
  if (text.length > 400) text = text.slice(0,397) + '...';
  return text;
}

function sanitizeReview(r){
  return {
    author: (r.author_name || 'Guest').split(' ')[0], // first name only for privacy
    rating: Math.max(1, Math.min(5, Math.round(Number(r.rating) || 5))),
    text: sanitizeText(r.text || r.relative_time_description || ''),
    time: r.time || null
  };
}

exports.handler = async function(event){
  try{
    const envKey = process.env.GOOGLE_PLACES_API_KEY;
    const envPlace = process.env.GOOGLE_PLACE_ID;
    if(!envKey || !envPlace){
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing environment variables: GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID' }) };
    }

    const noCache = (event.queryStringParameters && event.queryStringParameters.noCache === 'true');
    if(!noCache && cache.data && (Date.now() - cache.ts) < CACHE_TTL){
      return { statusCode: 200, body: JSON.stringify(cache.data) };
    }

    const fetchFn = await getFetch();
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(envPlace)}&fields=name,rating,reviews&key=${encodeURIComponent(envKey)}`;
    const res = await fetchFn(url);
    if(!res.ok) throw new Error('Places API request failed');
    const json = await res.json();

    const reviewsRaw = (json.result && json.result.reviews) ? json.result.reviews : [];
    const reviews = reviewsRaw.slice(0,6).map(sanitizeReview);

    const payload = {
      name: json.result?.name || 'Hot Tea',
      rating: json.result?.rating || null,
      reviews,
      fetchedAt: new Date().toISOString()
    };

    cache = { ts: Date.now(), data: payload };
    return { statusCode: 200, body: JSON.stringify(payload) };

  } catch(err){
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};