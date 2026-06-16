document.getElementById('year').textContent = new Date().getFullYear();

const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('active'));
});


// Bouncing bug
const circle = document.getElementById('mouse-circle');
if (circle) {
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let angle = Math.random() * Math.PI * 2;
  const SPEED = 2;
  let bugMsg = null;
  let msgTimer = null;

  function getRadius() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.05;
    return size / 2;
  }

  function updateMsgPosition() {
    if (bugMsg) {
      const r = getRadius();
      bugMsg.style.left = (cx + r + 12) + 'px';
      bugMsg.style.top = (cy - 10) + 'px';
    }
  }

  function bounce() {
    cx += Math.cos(angle) * SPEED;
    cy += Math.sin(angle) * SPEED;

    const r = getRadius();
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (cx < r) { cx = r; angle = Math.PI - angle; }
    else if (cx > w - r) { cx = w - r; angle = Math.PI - angle; }
    if (cy < r) { cy = r; angle = -angle; }
    else if (cy > h - r) { cy = h - r; angle = -angle; }

    circle.style.left = cx + 'px';
    circle.style.top = cy + 'px';
    circle.style.transform = `translate(-50%, -50%) rotate(${angle * 180 / Math.PI + 90}deg)`;
    updateMsgPosition();
    requestAnimationFrame(bounce);
  }

  setInterval(() => {
    angle += (Math.random() - 0.5) * Math.PI * 0.6;
  }, 2000 + Math.random() * 3000);

  circle.addEventListener('click', () => {
    if (bugMsg) return;
    bugMsg = document.createElement('div');
    bugMsg.className = 'bug-msg';
    bugMsg.textContent = '🎉 Congrats! You found a bug';
    document.body.appendChild(bugMsg);
    updateMsgPosition();
    msgTimer = setTimeout(() => {
      bugMsg.classList.add('bug-msg--fadeout');
      setTimeout(() => {
        bugMsg.remove();
        bugMsg = null;
        msgTimer = null;
      }, 5000);
    }, 2000);
  });

  bounce();
}

// Certifications carousel
(function () {
  const track = document.querySelector('.carousel-track');
  if (!track) return;
  const slides = Array.from(track.children);
  const prevBtn = document.querySelector('.carousel-btn--left');
  const nextBtn = document.querySelector('.carousel-btn--right');
  const dotsContainer = document.querySelector('.carousel-dots');

  let currentIndex = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  function goToSlide(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[currentIndex].classList.add('active');
  }

  prevBtn.addEventListener('click', () => {
    const prev = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prev);
  });

  nextBtn.addEventListener('click', () => {
    const next = (currentIndex + 1) % slides.length;
    goToSlide(next);
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  let interval = setInterval(() => {
    const next = (currentIndex + 1) % slides.length;
    goToSlide(next);
  }, 5000);

  const carousel = document.querySelector('.certs-carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(interval));
  carousel.addEventListener('mouseleave', () => {
    interval = setInterval(() => {
      const next = (currentIndex + 1) % slides.length;
      goToSlide(next);
    }, 5000);
  });
})();

document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.btn');
  const status = document.getElementById('form-status');
  const original = btn.textContent;
  const formData = new FormData(form);

  btn.textContent = 'Sending...';
  btn.disabled = true;
  status.textContent = '';

  try {
    const res = await fetch('/', {
      method: 'POST',
      body: new URLSearchParams(formData).toString(),
      headers: { 'Accept': 'application/x-www-form-urlencoded' }
    });

    if (res.ok) {
      status.textContent = 'Message sent successfully! I\'ll get back to you soon.';
      status.className = 'form-status success';
      form.reset();
    } else {
      throw new Error('Something went wrong. Please try again.');
    }
  } catch (err) {
    status.textContent = err.message;
    status.className = 'form-status error';
  }

  btn.textContent = original;
  btn.disabled = false;
});

