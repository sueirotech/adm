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
