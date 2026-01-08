// Fetch sanitized reviews from serverless function and render them
// Falls back to static content if the request fails

async function fetchReviews(){
  const endpoint = '/.netlify/functions/get-reviews';
  try{
    const res = await fetch(endpoint, {cache: 'no-store'});
    if(!res.ok) throw new Error('Network response was not ok');
    const json = await res.json();
    return json.reviews || [];
  } catch(err){
    console.warn('Failed to fetch live reviews:', err);
    return null;
  }
}

function renderStars(n){
  const work = Math.max(1, Math.min(5, Math.round(n||5)));
  return '★'.repeat(work) + '☆'.repeat(5-work);
}

function renderReviewCard(r){
  const art = document.createElement('article');
  art.className = 'review-card';
  art.innerHTML = `<h3>${escapeHtml(r.author)}</h3><p>${escapeHtml(r.text)}</p><div class="stars">${renderStars(r.rating)}</div>`;
  return art;
}

function escapeHtml(str){
  return String(str || '').replace(/[&<>"']/g, function(s){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s];
  });
}

document.addEventListener('DOMContentLoaded', async function(){
  const container = document.getElementById('live-reviews');
  if(!container) return;

  // show loader
  const loader = document.createElement('div'); loader.className = 'muted small'; loader.textContent = 'Loading latest reviews…';
  container.prepend(loader);

  const reviews = await fetchReviews();
  loader.remove();
  if(!reviews){
    // leave fallback static reviews
    return;
  }

  // replace existing static fallbacks with live ones
  container.innerHTML = '';
  reviews.forEach(r => container.appendChild(renderReviewCard(r)));
});