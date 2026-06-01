(function () {
  var carousels = document.querySelectorAll('[data-carousel]');

  carousels.forEach(function (root) {
    var slides = root.querySelectorAll('.acad-carousel-track > img, .acad-carousel-track > video');
    var dots = root.querySelectorAll('.acad-carousel-dots button');
    var prev = root.querySelector('.acad-carousel-btn--prev');
    var next = root.querySelector('.acad-carousel-btn--next');
    var count = slides.length;

    root.setAttribute('data-count', String(count));
    if (count <= 1) return;

    var interval = parseInt(root.getAttribute('data-interval'), 10) || 3000;
    var index = 0;
    var timer = null;
    var stopped = false;

    var caption = root.querySelector('figcaption');

    function show(i) {
      index = (i + count) % count;
      slides.forEach(function (slide, k) {
        var active = k === index;
        slide.classList.toggle('is-active', active);
        if (slide.tagName === 'VIDEO') {
          if (active) {
            try { slide.currentTime = 0; } catch (e) { }
            var p = slide.play();
            if (p && p.catch) p.catch(function () { });
          } else {
            slide.pause();
          }
        }
      });
      dots.forEach(function (d, k) {
        d.classList.toggle('is-active', k === index);
      });
      if (caption) {
        var text = slides[index].getAttribute('data-caption');
        if (text) caption.textContent = text;
      }
    }

    function startAuto() {
      if (stopped || timer) return;
      timer = setInterval(function () {
        show(index + 1);
      }, interval);
    }

    function stopAuto() {
      if (stopped) return;
      stopped = true;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        stopAuto();
        show(index - 1);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        stopAuto();
        show(index + 1);
      });
    }

    dots.forEach(function (dot, k) {
      dot.addEventListener('click', function () {
        stopAuto();
        show(k);
      });
    });

    var touchStartX = null;
    root.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    root.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) < 30) return;
      stopAuto();
      show(index + (dx < 0 ? 1 : -1));
    });

    show(0);
    startAuto();
  });
})();
