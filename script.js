const siteHeader = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const year = document.getElementById('year');
const cookieBanner = document.getElementById('cookie-banner');
const cookieAccept = document.getElementById('cookie-accept');
const cookieDismiss = document.getElementById('cookie-dismiss');
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (siteHeader) {
  const handleHeader = () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 24);
  };

  handleHeader();
  window.addEventListener('scroll', handleHeader, { passive: true });
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (cookieBanner && cookieAccept && cookieDismiss) {
  const hasAcceptedCookies = localStorage.getItem('atelier-cookie-consent');

  if (!hasAcceptedCookies) {
    cookieBanner.classList.remove('hidden');
  } else {
    cookieBanner.classList.add('hidden');
  }

  const hideBanner = () => cookieBanner.classList.add('hidden');

  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('atelier-cookie-consent', 'accepted');
    hideBanner();
  });

  cookieDismiss.addEventListener('click', () => {
    localStorage.setItem('atelier-cookie-consent', 'dismissed');
    hideBanner();
  });
}

if (contactForm && formMessage) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formMessage.textContent = 'Grazie. La tua richiesta è stata ricevuta e verrà gestita con attenzione.';
    contactForm.reset();
  });
}

const revealItems = document.querySelectorAll('.reveal');

if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
}
