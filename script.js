const dialog = document.querySelector('.demo');
const result = document.querySelector('#search-result');

document.querySelectorAll('[data-open-demo]').forEach((button) => {
  button.addEventListener('click', () => {
    dialog.showModal();
    document.querySelector('#product').focus();
  });
});

document.querySelector('[data-close-demo]').addEventListener('click', () => dialog.close());

document.querySelector('#search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const product = new FormData(event.currentTarget).get('product').trim();
  if (!product) {
    result.textContent = 'Digite o nome de um produto para consultar.';
    result.classList.remove('active');
    return;
  }
  result.textContent = `Consulta registrada para “${product}”. Em uma implantação, o ponto de consulta exibiria preço, corredor e promoções atualizadas.`;
  result.classList.add('active');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const progress = document.querySelector('.reading-progress span');
const chapterStatus = document.querySelector('.chapter-status b');
const chapters = document.querySelectorAll('[data-chapter]');

const updateProgress = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progress.style.width = `${percentage}%`;
};

const chapterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      chapterStatus.textContent = entry.target.dataset.chapter;
    }
  });
}, { threshold: 0.48 });

chapters.forEach((chapter) => chapterObserver.observe(chapter));
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const parallaxImage = document.querySelector('[data-parallax]');
const floatingCard = document.querySelector('[data-float]');
const hero = document.querySelector('.hero');

hero.addEventListener('pointermove', (event) => {
  const bounds = hero.getBoundingClientRect();
  const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
  const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
  parallaxImage.style.setProperty('--shift-x', `${horizontal * 14}px`);
  parallaxImage.style.setProperty('--shift-y', `${vertical * 10}px`);
  floatingCard.style.setProperty('--float-x', `${horizontal * -17}px`);
  floatingCard.style.setProperty('--float-y', `${vertical * -13}px`);
});

hero.addEventListener('pointerleave', () => {
  parallaxImage.style.setProperty('--shift-x', '0px');
  parallaxImage.style.setProperty('--shift-y', '0px');
  floatingCard.style.setProperty('--float-x', '0px');
  floatingCard.style.setProperty('--float-y', '0px');
});
