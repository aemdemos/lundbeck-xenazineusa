import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  const sections = [...fragment.children];
  const [logoSection, introSection] = sections;

  const brandBand = document.createElement('div');
  brandBand.className = 'nav-brand-band';

  const brandInner = document.createElement('div');
  brandInner.className = 'nav-brand-inner';

  const logoPara = logoSection?.querySelector('p');
  if (logoPara) {
    const logoWrapper = document.createElement('div');
    logoWrapper.className = 'nav-brand';
    const logoContent = logoPara.querySelector('a') || logoPara.querySelector('img');
    if (logoContent) logoWrapper.append(logoContent.cloneNode(true));
    brandInner.append(logoWrapper);
  }

  const intros = introSection ? [...introSection.querySelectorAll('p')] : [];
  if (intros.length) {
    const intro = document.createElement('div');
    intro.className = 'nav-intro';
    intros.forEach((p) => intro.append(p.cloneNode(true)));
    brandInner.append(intro);
  }

  brandBand.append(brandInner);
  nav.append(brandBand);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
