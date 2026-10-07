const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

const closeMenu = () => {
  nav?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
};

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 24), { passive: true });

const observer = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 })
  : null;
document.querySelectorAll('.reveal').forEach((node) => observer ? observer.observe(node) : node.classList.add('visible'));

document.querySelectorAll('[data-interest]').forEach((link) => link.addEventListener('click', () => {
  const select = document.querySelector('[name="interest"]');
  if (select) select.value = link.dataset.interest;
}));

const form = document.querySelector('[data-contact-form]');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = `Lame Brain Ideas — ${data.get('interest')}`;
  const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nStarting point: ${data.get('interest')}\n\nGoal:\n${data.get('goal')}\n\nPlease do not treat this message as confidential until we have confirmed an engagement and agreed on handling terms.`;
  document.querySelector('[data-form-status]').textContent = 'Opening a message in your mail app. If nothing happens, email hello@lamebrainideas.com.';
  window.location.href = `mailto:hello@lamebrainideas.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = String(new Date().getFullYear()); });
