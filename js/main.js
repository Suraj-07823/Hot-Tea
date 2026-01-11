// Minimal JS: mobile nav toggle, accessible behavior, and year filler

function openNav(navToggle, nav){
  if(!navToggle || !nav) return;
  const header = document.querySelector('.site-header');
  // position the overlay under the header to avoid overlap
  if(header){
    nav.style.top = (header.offsetHeight || 56) + 'px';
  }
  navToggle.setAttribute('aria-expanded','true');
  nav.classList.add('open');
  nav.setAttribute('aria-hidden','false');
  // focus the first link inside the mobile nav for keyboard users
  const firstLink = nav.querySelector('a'); if(firstLink) firstLink.focus();
  document.body.style.overflow = 'hidden';
}

function closeNav(navToggle, nav){
  if(!navToggle || !nav) return;
  navToggle.setAttribute('aria-expanded','false');
  nav.classList.remove('open');
  nav.setAttribute('aria-hidden','true');
  // remove inline top style added when opening
  nav.style.top = '';
  document.body.style.overflow = '';
  // return focus to the toggle for keyboard users
  if(navToggle) navToggle.focus();
}

document.addEventListener('DOMContentLoaded', function(){
  const navToggle = document.getElementById('nav-toggle');
  // prefer the id, but fall back to the primary-nav element and ensure an id exists
  let nav = document.getElementById('primary-navigation');
  if(!nav){ nav = document.querySelector('.primary-nav'); if(nav) nav.id = 'primary-navigation'; }
  if(nav){ nav.setAttribute('aria-hidden','true'); }

  if(navToggle){
    navToggle.addEventListener('click', function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      if(expanded){ closeNav(navToggle, nav); } else { openNav(navToggle, nav); }
    });
  }

  // close mobile nav on link click
  if(nav){
    nav.addEventListener('click', function(e){
      if(e.target && e.target.matches('a')){
        closeNav(navToggle, nav);
      }
    });
  }

  // close nav on Escape
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeNav(navToggle, nav);
  });

  // ensure mobile nav stays below header when resizing
  window.addEventListener('resize', function(){
    const header = document.querySelector('.site-header');
    if(nav && nav.classList.contains('open') && header){
      nav.style.top = (header.offsetHeight || 56) + 'px';
    }
  });

  // Map lazy-loader: inject iframe on user click or when in-view
  function loadMap(placeholder){
    if(!placeholder) return;
    const src = placeholder.getAttribute('data-map-src');
    if(!src) return;
    const iframe = document.createElement('iframe');
    iframe.setAttribute('title','Hot Tea Location');
    iframe.setAttribute('src',src);
    iframe.setAttribute('loading','lazy');
    iframe.style.width='100%'; iframe.style.height='240px'; iframe.style.border='0'; iframe.style.borderRadius='8px';
    // clear children and append
    placeholder.innerHTML='';
    placeholder.appendChild(iframe);
  }
  document.querySelectorAll('.load-map').forEach(btn=>{
    btn.addEventListener('click', function(){
      const container = this.closest('.map-embed');
      loadMap(container);
    });
  });
  /* Optional: auto-load maps for elements that opt-in to automatic loading
     Add `data-auto-load="true"` to a `.map-embed` if you want it to load when scrolled into view. */
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ 
        const el = e.target;
        if(e.isIntersecting && el.getAttribute('data-auto-load') === 'true'){
          loadMap(el); io.unobserve(el);
        }
      });
    },{rootMargin:'200px'});
    document.querySelectorAll('.map-embed').forEach(el=>io.observe(el));
  }

  // populate year
  const y = new Date().getFullYear();
  ['year','year-2','year-3','year-4','year-5'].forEach(id=>{const el=document.getElementById(id); if(el) el.textContent=y});
});