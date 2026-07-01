/**
 * ISI (Important Safety Information) block.
 *
 * Authored with two rows:
 *   Row 1 – abbreviated content shown in the persistent fixed bottom bar.
 *   Row 2 – full inline content rendered in-page when the section scrolls into view.
 *
 * Behaviour:
 *   • When the ISI **section** is outside the viewport the fixed bar is visible.
 *   • Clicking the "+" scrolls to the inline ISI content on the page.
 *   • Clicking the "−" scrolls to the top of the page (matches xenazineusa.com).
 *   • Once the section scrolls into view the bar hides and the inline content displays.
 *
 * @param {HTMLElement} block
 */

/** Matches xenazineusa.com jQuery animate duration (1E3 ms) */
const ISI_SCROLL_DURATION_MS = 1000;

const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2);

/**
 * Smooth scroll to a vertical position with explicit duration.
 * @param {number} targetY
 * @param {number} duration
 */
function smoothScrollTo(targetY, duration = ISI_SCROLL_DURATION_MS) {
  const start = window.scrollY;
  const distance = targetY - start;
  if (distance === 0) return;
  const startTime = performance.now();

  const step = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    window.scrollTo(0, start + distance * easeInOutQuad(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/**
 * Smooth scroll with explicit duration (native smooth scroll speed is not configurable).
 * @param {HTMLElement} element
 * @param {number} duration
 */
function scrollToElement(element, duration = ISI_SCROLL_DURATION_MS) {
  const scrollMargin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
  const target = element.getBoundingClientRect().top + window.scrollY - scrollMargin;
  smoothScrollTo(target, duration);
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  /* ── 1. Split authored rows ─────────────────────────────────── */
  const abbreviatedRow = rows[0];
  const inlineRow = rows[1];

  /* Mark the inline row so CSS can control its visibility */
  inlineRow.classList.add('isi-inline');
  inlineRow.id = 'SafetyPanelInfo';

  const inlineHeading = inlineRow.querySelector('h3');
  if (inlineHeading) {
    inlineHeading.classList.add('isi-inline-heading');
    const inlineToggle = document.createElement('button');
    inlineToggle.className = 'isi-inline-toggle';
    inlineToggle.type = 'button';
    inlineToggle.setAttribute('aria-label', 'Collapse safety information');
    const icon = document.createElement('span');
    icon.className = 'isi-inline-toggle-icon';
    icon.setAttribute('aria-hidden', 'true');
    inlineToggle.append(icon);
    inlineHeading.append(inlineToggle);

    inlineToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      smoothScrollTo(0);
    });
  }

  /* ── 2. Build the fixed bottom bar ──────────────────────────── */
  const bar = document.createElement('div');
  bar.className = 'isi-bar';
  bar.setAttribute('aria-label', 'Important Safety Information');

  /* Move the abbreviated content into the bar */
  const barContent = document.createElement('div');
  barContent.className = 'isi-bar-content';

  /* Re-parent abbreviated children into the bar content wrapper */
  const abbrCells = [...abbreviatedRow.children];
  abbrCells.forEach((cell) => {
    cell.classList.add('isi-bar-col');
    barContent.append(cell);
  });

  /* Toggle button (+) – scrolls to inline ISI */
  const toggle = document.createElement('button');
  toggle.className = 'isi-bar-toggle';
  toggle.setAttribute('aria-label', 'View full safety information');
  toggle.type = 'button';
  const icon = document.createElement('span');
  icon.className = 'isi-bar-toggle-icon';
  toggle.append(icon);

  bar.append(barContent);
  bar.append(toggle);

  /* Remove the now-empty abbreviated row from the block */
  abbreviatedRow.remove();

  /* Append bar to <body> so it sits outside the page flow */
  document.body.append(bar);

  const scrollToInlineIsi = () => {
    scrollToElement(inlineRow);
  };

  /* ── 3. Scroll to inline content on "+" click ───────────────── */
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    scrollToInlineIsi();
  });

  /* ── 4. IntersectionObserver – show/hide the bar ────────────── */
  const section = block.closest('.section');
  if (!section) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        bar.classList.add('isi-bar-hidden');
      } else {
        bar.classList.remove('isi-bar-hidden');
      }
    },
    { threshold: 0 },
  );

  observer.observe(section);
}
