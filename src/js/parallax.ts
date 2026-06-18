// Moteur de parallaxe générique partagé (index, about).
// Chaque élément portant [data-parallax-speed] reçoit une CSS var --parallax-y
// proportionnelle au scroll, depuis son point neutre (position au repos centrée
// dans le viewport ; 0 pour les éléments visibles dès le chargement).
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// Pas de parallaxe sur appareils tactiles (mobile/tablette) : l'effet est pensé
// pour le desktop, et le scroll inertiel iOS met à jour la position par à-coups
// (rendu saccadé). On s'aligne sur le garde tactile des vidéos témoignages
// (« (hover: none), (pointer: coarse) » dans index.astro). Les éléments gardent
// leur position au repos via le fallback « var(--parallax-y, 0px) ».
const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

if (!reduced && !coarsePointer) {
  interface ParallaxItem {
    el: HTMLElement;
    speed: number;
    neutral: number;
    applied: number;
  }

  const allEls = document.querySelectorAll<HTMLElement>(
    "[data-parallax-speed]",
  );
  const items: ParallaxItem[] = [];

  allEls.forEach((el) => {
    const speed = parseFloat(el.dataset.parallaxSpeed ?? "0");
    if (isNaN(speed)) return;
    items.push({ el, speed, neutral: 0, applied: 0 });
  });

  const calcNeutral = (item: ParallaxItem) => {
    const rect = item.el.getBoundingClientRect();
    // On retire le décalage déjà appliqué pour mesurer la position « au repos ».
    const centerInDoc =
      window.scrollY + rect.top + rect.height / 2 - item.applied;
    item.neutral = Math.max(0, centerInDoc - window.innerHeight / 2);
  };

  const applyParallax = () => {
    const y = window.scrollY;
    items.forEach((item) => {
      item.applied = (y - item.neutral) * item.speed;
      item.el.style.setProperty("--parallax-y", `${item.applied}px`);
    });
  };

  items.forEach(calcNeutral);
  applyParallax();

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        applyParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Recalcule les points neutres au resize (le layout peut changer),
  // throttlé en rAF car iOS émet des rafales de resize.
  let resizing = false;

  window.addEventListener("resize", () => {
    if (!resizing) {
      requestAnimationFrame(() => {
        items.forEach(calcNeutral);
        applyParallax();
        resizing = false;
      });
      resizing = true;
    }
  });
}
