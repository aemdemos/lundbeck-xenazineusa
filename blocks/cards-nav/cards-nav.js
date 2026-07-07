import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation, getBlockId, decorateExternalLinks } from '../../scripts/scripts.js';
import { createCard } from '../card/card.js';

export default function decorate(block) {
  const blockId = getBlockId('cards-nav');
  block.setAttribute('id', blockId);
  block.setAttribute('aria-label', `Cards-nav for ${blockId}`);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Cards-nav');

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const card = createCard(row);
    const link = card.querySelector('a');
    if (link) {
      const cardLink = document.createElement('a');
      cardLink.href = link.href;
      while (card.firstChild) cardLink.append(card.firstChild);
      card.append(cardLink);
      const innerLink = cardLink.querySelector('a');
      if (innerLink) innerLink.replaceWith(...innerLink.childNodes);
    }
    ul.append(card);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  const cardCount = ul.children.length;
  if (cardCount === 2 || cardCount === 3) {
    block.classList.add(`cards-nav-${cardCount}-cols`);
  }

  block.textContent = '';
  block.append(ul);

  // cards rebuild their anchors from scratch (only href is copied), so re-apply
  // the external-link / PDF new-tab decoration to the freshly created links.
  decorateExternalLinks(block);
}
