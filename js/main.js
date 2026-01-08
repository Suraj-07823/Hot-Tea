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
  const nav = document.getElementById('primary-navigation');
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

  // populate year
  const y = new Date().getFullYear();
  ['year','year-2','year-3','year-4','year-5'].forEach(id=>{const el=document.getElementById(id); if(el) el.textContent=y});
});