const slides = [...document.querySelectorAll('.slide')];
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const count = document.querySelector('#current');
const progress = document.querySelector('.progress span');
const dots = document.querySelector('.dots');
const announcement = document.querySelector('#announce');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let index = 0;
let transitioning = false;

slides.forEach((slide, slideIndex) => {
  const button = document.createElement('button');
  button.setAttribute('aria-label', `Ir para o slide ${slideIndex + 1}`);
  button.addEventListener('click', () => goTo(slideIndex));
  dots.appendChild(button);
});

function updateControls() {
  count.textContent = String(index + 1).padStart(2, '0');
  document.querySelector('#total').textContent = String(slides.length).padStart(2, '0');
  progress.style.width = `${((index + 1) / slides.length) * 100}%`;
  previous.disabled = index === 0;
  next.disabled = index === slides.length - 1;
  [...dots.children].forEach((button, buttonIndex) => {
    if (buttonIndex === index) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
}

function goTo(target) {
  if (transitioning || target < 0 || target >= slides.length || target === index) return;
  transitioning = true;
  const outgoing = slides[index];
  const incoming = slides[target];
  incoming.hidden = false;
  incoming.scrollTop = 0;
  outgoing.classList.add('leaving');
  incoming.classList.add('entering');
  index = target;
  updateControls();
  announcement.textContent = `Slide ${index + 1} de ${slides.length}: ${incoming.querySelector('h1, h2').textContent}`;
  history.replaceState(null, '', `#${incoming.id}`);
  window.setTimeout(() => {
    outgoing.hidden = true;
    outgoing.classList.remove('active', 'leaving');
    incoming.classList.remove('entering');
    incoming.classList.add('active');
    transitioning = false;
  }, reducedMotion.matches ? 0 : 620);
}

previous.addEventListener('click', () => goTo(index - 1));
next.addEventListener('click', () => goTo(index + 1));
document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => goTo(index + 1)));
document.querySelector('[data-restart]').addEventListener('click', () => goTo(0));
document.querySelector('.brand').addEventListener('click', event => { event.preventDefault(); goTo(0); });
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); goTo(index + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(index - 1); }
});

const initial = slides.findIndex(slide => `#${slide.id}` === location.hash);
if (initial > 0) {
  slides[0].hidden = true;
  slides[0].classList.remove('active');
  index = initial;
  slides[index].hidden = false;
  slides[index].classList.add('active');
}
updateControls();
