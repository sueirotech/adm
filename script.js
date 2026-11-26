const slides = [...document.querySelectorAll('.slide')];
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const count = document.querySelector('#current');
const progress = document.querySelector('.progress span');
const dots = document.querySelector('.dots');
const curtain = document.querySelector('.transition-curtain');
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
  curtain.classList.add('play');
  const swapDelay = reducedMotion.matches ? 0 : 420;
  window.setTimeout(() => {
    slides[index].hidden = true;
    slides[index].classList.remove('active');
    index = target;
    slides[index].hidden = false;
    slides[index].scrollTop = 0;
    slides[index].classList.add('active');
    updateControls();
    announcement.textContent = `Slide ${index + 1} de ${slides.length}: ${slides[index].querySelector('h1, h2').textContent}`;
    history.replaceState(null, '', `#slide-${index + 1}`);
  }, swapDelay);
  window.setTimeout(() => {
    curtain.classList.remove('play');
    transitioning = false;
  }, reducedMotion.matches ? 20 : 1000);
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

const initial = Number(location.hash.match(/^#slide-(\d+)$/)?.[1]);
if (initial > 1 && initial <= slides.length) {
  slides[0].hidden = true;
  slides[0].classList.remove('active');
  index = initial - 1;
  slides[index].hidden = false;
  slides[index].classList.add('active');
}
updateControls();
