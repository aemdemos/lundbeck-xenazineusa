import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/content/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  const sections = [...fragment.children];
  const [brandSection, introSection, toolsSection] = sections;

  // Brand band: logo (left) + intro text (right)
  const brandBand = document.createElement('div');
  brandBand.className = 'nav-brand-band';

  const brandInner = document.createElement('div');
  brandInner.className = 'nav-brand-inner';

  if (brandSection) {
    const logoWrapper = document.createElement('div');
    logoWrapper.className = 'nav-brand';
    const logoLink = brandSection.querySelector('a');
    if (logoLink) logoWrapper.append(logoLink.cloneNode(true));
    brandInner.append(logoWrapper);
  }

  if (introSection) {
    const intro = document.createElement('div');
    intro.className = 'nav-intro';
    [...introSection.querySelectorAll('p')].forEach((p) => intro.append(p.cloneNode(true)));
    brandInner.append(intro);
  }

  brandBand.append(brandInner);
  nav.append(brandBand);

  // Nav band: icon-card links
  if (toolsSection) {
    const navBand = document.createElement('div');
    navBand.className = 'nav-links-band';

    const list = document.createElement('ul');
    list.className = 'nav-links-list';

    [...toolsSection.querySelectorAll('p')].forEach((p) => {
      const a = p.querySelector('a');
      if (!a) return;
      const li = document.createElement('li');
      const link = a.cloneNode(true);
      link.className = 'nav-card-link';
      const img = link.querySelector('img');
      if (img) img.className = 'nav-card-icon';
      li.append(link);
      list.append(li);
    });

    navBand.append(list);
    nav.append(navBand);
  }

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
