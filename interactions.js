const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
function displayTheme(dark) {
  root.dataset.theme = dark ? 'dark' : 'light';
  themeButton.setAttribute('aria-pressed', String(dark));
}
displayTheme(root.dataset.theme === 'dark');
themeButton.hidden = false;
themeButton.addEventListener('click', () => {
  displayTheme(root.dataset.theme !== 'dark');
  try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch {}
});
window.addEventListener('storage', event => {
  if (event.key === 'portfolio-theme') displayTheme(event.newValue === 'dark');
});

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function typeHeading(heading, interval) {
  // The original heading reserves its final height and remains accessible.
  const overlay = document.createElement('span');
  overlay.className = 'typed-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = heading.innerHTML;
  const walker = document.createTreeWalker(overlay, NodeFilter.SHOW_TEXT);
  const parts = [];
  while (walker.nextNode()) {
    parts.push({ node: walker.currentNode, text: walker.currentNode.data });
    walker.currentNode.data = '';
  }
  heading.classList.add('typing');
  heading.append(overlay);
  const start = performance.now();
  const total = parts.reduce((sum, part) => sum + part.text.length, 0);
  function render(now) {
    let visible = Math.floor((now - start) / interval) + 1;
    if (visible >= total || reducedMotion.matches) {
      overlay.remove();
      heading.classList.remove('typing');
      return;
    }
    for (const part of parts) {
      part.node.data = part.text.slice(0, Math.max(0, visible));
      visible -= part.text.length;
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
if (!reducedMotion.matches) {
  typeHeading(document.querySelector('h1'), document.querySelector('.hero') ? 75 : 27);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove('awaiting-reveal');
        observer.unobserve(entry.target);
      }
    });
    for (const row of document.querySelectorAll('.projects li')) {
      row.classList.add('reveal-row', 'awaiting-reveal');
      observer.observe(row);
    }
  }
}
