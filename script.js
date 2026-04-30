const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const links = document.querySelectorAll('.site-nav a');

toggle?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('is-open') ?? false;
  toggle.setAttribute('aria-expanded', String(isOpen));
});

nav?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }
});

const sections = [...links]
  .map((link) => document.querySelector(link.getAttribute('href') || ''))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
    });
  },
  { rootMargin: '-40% 0px -48% 0px', threshold: [0.15, 0.35, 0.6] },
);

sections.forEach((section) => observer.observe(section));
