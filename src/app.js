import { gsap } from "gsap";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);

const mySections = {
  sections: gsap.utils.toArray(".slider-section"),
  bg: gsap.utils.toArray(".slider-section .bg"),
  bgContainer: gsap.utils.toArray(".slider-section .inner-container"),
  miniItems: gsap.utils.toArray(".slider-mini-item"),
  miniItemsBg: gsap.utils.toArray(".slider-mini-item .bg"),
  miniItemsBgContainer: gsap.utils.toArray(
    ".slider-mini-item .inner-container"
  ),
  text: gsap.utils.toArray(".slider-section .text"),
};

let currentSection = -1;
let isAnimating = false;

const wrapIndex = (min, max, index) => {
  return gsap.utils.wrap(min, max, index);
};

const setAnimating = (value) => {
  isAnimating = value;
};

const animateSection = (sectionsObj, index, direction) => {
  const sections = sectionsObj.sections;
  const bg = sectionsObj.bg;
  const bgContainer = sectionsObj.bgContainer;
  const miniItems = sectionsObj.miniItems;
  const miniItemsBg = sectionsObj.miniItemsBg;
  const miniItemsBgContainer = sectionsObj.miniItemsBgContainer;
  const text = sectionsObj.text;
  let getDirection = direction === -1 ? -1 : 1;

  // Envolvemos el índice de la sección
  index = wrapIndex(0, sections.length, index);

  // Indicamos que la animación está activa
  setAnimating(true);

  const timeline = gsap.timeline({
    defaults: {
      duration: 1.5,
      ease: "power3.out",
    },
    onComplete: () => {
      setAnimating(false);
    },
  });

  gsap.set([sections, miniItems], { zIndex: 0 });
  gsap.set([sections[index], miniItems[index]], { zIndex: 1, autoAlpha: 1 });

  // Si hay una sección activa actualmente, animamos el fondo de esa sección para que desaparezca y ocultamos la sección y miniatura correspondientes

  if (currentSection >= 0) {
    gsap
      .timeline()
      .set(text[currentSection], { opacity: 1 })
      .fromTo(
        text[currentSection],
        { opacity: 1 },
        { opacity: 0, duration: 0.3, yPercent: -50 * getDirection }
      );

    timeline
      .to([bg[currentSection], miniItemsBg[currentSection]], {
        yPercent: -50 * getDirection,
      })
      .set([sections[currentSection], miniItems[currentSection]], {
        autoAlpha: 0,
      });
  }

  // Asignamos la sección activa actual
  currentSection = index;

  // Animamos el fondo y el contenedor de la nueva sección para que aparezcan
  timeline
    .fromTo(
      [bg[index], miniItemsBg[index]],
      { yPercent: -50 * getDirection },
      { yPercent: 0 },
      0
    )
    .fromTo(
      [bgContainer[index], miniItemsBgContainer[index]],
      { yPercent: 100 * getDirection },
      { yPercent: 0 },
      0
    );

  gsap
    .timeline()
    .set(text[index], { opacity: 0 })
    .fromTo(
      text[index],
      { opacity: 0, yPercent: -50 * getDirection },
      { opacity: 1, duration: 0.3, yPercent: 0 }
    );
};

const handleScroll = (sectionsObj, index, direction) => {
  if (!isAnimating) {
    animateSection(sectionsObj, index, direction);
  }
};

Observer.create({
  type: "wheel,touch,pointer",
  wheelSpeed: -1,
  onDown: () => handleScroll(mySections, currentSection - 1, -1),
  onUp: () => handleScroll(mySections, currentSection + 1, 1),
  tolerance: 50,
  preventDefault: true,
});

animateSection(mySections, 0, 1);