// Tiny intersection observer to add .in-view to elements with .animate-on-scroll
(function(){
  if(!('IntersectionObserver' in window)){
    // fallback: add class after small delay
    document.querySelectorAll('.animate-on-scroll').forEach(el=>el.classList.add('in-view'))
    return
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('in-view'); io.unobserve(entry.target); }
    })
  },{rootMargin:'-10% 0px',threshold:0.08})
  document.querySelectorAll('.animate-on-scroll').forEach(el=>io.observe(el))
})();