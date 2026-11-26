const slides = [...document.querySelectorAll('.slide')];
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
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
  const swapDelay = reducedMotion.matches ? 0 : 650;
  window.setTimeout(() => {
    slides[index].hidden = true;
    slides[index].classList.remove('active');
    index = target;
    slides[index].hidden = false;
    slides[index].scrollTop = 0;
    slides[index].classList.add('active');
    updateControls();
    announcement.textContent = `Slide ${index + 1} de ${slides.length}: ${slides[index].querySelector('h1, h2').textContent}`;
    history.replaceState(null, '', `#${slides[index].id}`);
  }, swapDelay);
  window.setTimeout(() => {
    curtain.classList.remove('play');
    transitioning = false;
  }, reducedMotion.matches ? 20 : 1500);
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

function animateHeadingLetters(heading) {
  if (heading.dataset.lettersReady) return;
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  let letterIndex = 0;
  textNodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    [...node.textContent].forEach((character) => {
      if (character === ' ') {
        fragment.append(document.createTextNode(character));
        return;
      }
      const letter = document.createElement('span');
      letter.className = 'letter';
      letter.style.setProperty('--letter-index', letterIndex);
      letter.textContent = character;
      fragment.append(letter);
      letterIndex += 1;
    });
    node.replaceWith(fragment);
  });
  heading.dataset.lettersReady = 'true';
  heading.classList.add('title-jump');
}

document.querySelectorAll('h1, h2').forEach(animateHeadingLetters);
