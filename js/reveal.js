(function () {
  var SELECTORS = [
    '.sect-intro', '.tl', '.job', '.pjob',
    '.acad-card', '.perso', '.skill-card',
    '.cbtn', '.foot', '.phero', '.phero-back',
    '.quote', '.pjob-subsect'
  ].join(',');

  var isEntryPage = document.body.classList.contains('entry-anim');

  var elements = Array.from(document.querySelectorAll(SELECTORS)).filter(function (el) {
    if (isEntryPage && el.closest('.hero')) return false;
    return true;
  });

  if (!elements.length) return;

  elements.forEach(function (el) { el.classList.add('reveal'); });

  /* stagger siblings that share the same direct parent */
  var seen = new WeakSet();
  elements.forEach(function (el) {
    var p = el.parentNode;
    if (seen.has(p)) return;
    seen.add(p);
    var group = elements.filter(function (e) { return e.parentNode === p; });
    group.forEach(function (e, i) {
      e.style.transitionDelay = (i * 0.09) + 's';
    });
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  elements.forEach(function (el) { observer.observe(el); });
})();
