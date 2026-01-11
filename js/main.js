// Minimal JS: mobile nav toggle, accessible behavior, and year filler
function closeNav(navToggle, nav){
  if(!navToggle || !nav) return;
  navToggle.setAttribute('aria-expanded','false');
  nav.classList.remove('open');
  nav.setAttribute('aria-hidden','true');
}

function openNav(navToggle, nav){
  if(!navToggle || !nav) return;
  navToggle.setAttribute('aria-expanded','true');
  nav.classList.add('open');
  nav.setAttribute('aria-hidden','false');
}

document.addEventListener('DOMContentLoaded', function(){
  const navToggle = document.getElementById('nav-toggle');
  // prefer the id, but fall back to the primary-nav element and ensure an id exists
  let nav = document.getElementById('primary-navigation');
  if(!nav){ nav = document.querySelector('.primary-nav'); if(nav) nav.id = 'primary-navigation'; }
  function updateNavAria(){ if(!nav) return; const isHidden = window.getComputedStyle(nav).display === 'none'; nav.setAttribute('aria-hidden', isHidden ? 'true' : 'false'); }
  if(nav){ updateNavAria(); window.addEventListener('resize', updateNavAria); }

  if(navToggle){
    navToggle.addEventListener('click', function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      if(expanded){ closeNav(navToggle, nav); } else { openNav(navToggle, nav); }
    });
  }

  // Order buttons: if href is a direct wa.me link, allow default; otherwise construct and open a wa.me url
  document.querySelectorAll('.order-btn').forEach(btn=>{
    btn.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href && href.startsWith('https://wa.me/')) return; // default navigation
      e.preventDefault();
      const section = this.getAttribute('data-section') || 'Hot Tea';
      const message = `Hi, I'd like to order from ${section}. Please share availability and pickup/delivery info.`;
      const phone = '911234567890';
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
  });

  // close mobile nav on link click (only on small screens) and set active link
  if(nav){
    nav.addEventListener('click', function(e){
      if(e.target && e.target.matches('a')){
        if(window.innerWidth < 760){ closeNav(navToggle, nav); }
        // set active state
        document.querySelectorAll('.primary-nav a').forEach(a=>a.classList.remove('active'));
        e.target.classList.add('active');
      }
    });
    // mark the current page link as active on load
    document.querySelectorAll('.primary-nav a').forEach(a=>{
      const href = a.getAttribute('href');
      if(href && location.pathname.endsWith(href)) a.classList.add('active');
    });
  }

  // close nav on Escape
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeNav(navToggle, nav);
  });

  // populate year
  const y = new Date().getFullYear();
  ['year','year-2','year-3','year-4','year-5','year-6'].forEach(id=>{const el=document.getElementById(id); if(el) el.textContent=y});

  // PWA: deferred install prompt handling and service worker registration
  let deferredPrompt;
  const installBtn = document.getElementById('install-btn');
  window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault();
    deferredPrompt = e;
    if(installBtn) installBtn.removeAttribute('aria-hidden');
  });
  if(installBtn){
    installBtn.addEventListener('click', async ()=>{
      if(!deferredPrompt) return;
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if(choice && choice.outcome === 'accepted'){
        installBtn.setAttribute('aria-hidden','true');
      } else {
        installBtn.setAttribute('aria-hidden','true');
      }
      deferredPrompt = null;
    });
  }
  window.addEventListener('appinstalled', ()=>{ if(installBtn) installBtn.setAttribute('aria-hidden','true'); deferredPrompt = null; });

  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  }

  // Make CTA buttons explicitly navigate (helps in some mobile contexts)
  document.querySelectorAll('.cta-row a, .reviews-cta a').forEach(a=>{
    a.addEventListener('click', function(e){
      // ensure navigation occurs even if other handlers interfere
      const href = this.getAttribute('href');
      if(!href) return;
      // allow normal behaviour for external links
      if(href.startsWith('http')) return; 
      e.preventDefault();
      window.location.href = href;
    });
  });

  // Add lightweight click/keyboard animation to menu titles and reviewer names
  function animateTap(el){
    if(!el) return;
    el.classList.add('is-active');
    setTimeout(()=>el.classList.remove('is-active'),180);
  }
  document.querySelectorAll('.menu-card h2, .reviewer').forEach(el=>{
    el.setAttribute('tabindex', '0'); // make focusable
    el.addEventListener('click', ()=>animateTap(el));
    el.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); animateTap(el); } });
  });

  // Toggle .scrolled on header for subtle style changes when the page is scrolled
  (function(){
    const header = document.querySelector('.site-header');
    if(!header) return;
    let ticking = false;
    function update(){ header.classList.toggle('scrolled', window.scrollY > 8); ticking = false; }
    window.addEventListener('scroll', ()=>{ if(!ticking){ window.requestAnimationFrame(update); ticking = true; } });
    update();
  })();

});