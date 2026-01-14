// Intersection observer: add .in-view and trigger micro-animations
(function(){
  if(!('IntersectionObserver' in window)){
    // fallback: add class after small delay
    document.querySelectorAll('.animate-on-scroll').forEach(el=>el.classList.add('in-view'))
    return
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        el.classList.add('in-view');

        // Staggered children support
        const staggerParent = el.querySelector('.stagger');
        if(staggerParent){
          Array.from(staggerParent.children).forEach((ch,i)=>ch.style.setProperty('--delay', `${i*0.06}s`));
        }

        // Hero CTA micro-animations
        if(el.classList && el.classList.contains('hero')){
          const ctas = el.querySelectorAll('.cta-row .btn');
          ctas.forEach((b,i)=>{ b.classList.add('animate-pop-fast'); b.style.animationDelay = `${i*0.06}s`; setTimeout(()=>b.classList.remove('animate-pop-fast'),900); });
        }

        // Reviews sparkle
        if(el.classList && el.classList.contains('review')){
          el.classList.add('animate-spark');
          const stars = el.querySelectorAll('.stars .star');
          stars.forEach((s,i)=>setTimeout(()=>s.classList.add('animate-sparkle'), i*90));
        }

        // Menu cards pop in when section enters view
        if(el.querySelectorAll && el.querySelectorAll('.menu-card').length){
          el.querySelectorAll('.menu-card').forEach((mc,i)=>{ mc.classList.add('animate-pop'); mc.style.transitionDelay = `${i*0.05}s`; });
        }

        io.unobserve(el);
      }
    })
  },{rootMargin:'-12% 0px',threshold:0.08})
  document.querySelectorAll('.animate-on-scroll').forEach(el=>io.observe(el))
})();