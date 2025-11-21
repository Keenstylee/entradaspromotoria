import whoIam from '../data/whoIam.js';

const whoIamContent = whoIam[0];

function createWhoIamSection() {
  const container = document.getElementById('who-iam-content');
  if (!container) return;

  Object.keys(whoIamContent).forEach(key => {
    const card = document.createElement('div');
    card.classList.add(
      'bg-white',
      'dark:bg-background-dark',
      'rounded-xl',
      'shadow-xl',
      'shadow-primary/20',
      'p-8',
      'transform',
      'hover:-translate-y-2',
      'transition-all',
      'duration-300',
      'ease-in-out',
      'border',
      'border-white/10'
    );

    const title = document.createElement('h3');
    title.classList.add(
      'text-3xl',
      'font-extrabold',
      'text-primary',
      'mb-4',
      'capitalize'
    );
    title.textContent = key.replace('-', ' ');

    const paragraph = document.createElement('p');
    paragraph.classList.add(
      'text-lg',
      'text-gray-700',
      'dark:text-gray-300',
      'leading-relaxed'
    );
    paragraph.textContent = whoIamContent[key];

    card.appendChild(title);
    card.appendChild(paragraph);
    container.appendChild(card);
  });
}

export default createWhoIamSection;