import { gsap } from "gsap";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);

const sections = gsap.utils.toArray(".slider-section");
const bg = gsap.utils.toArray(".slider-section .bg");
const bgContainer = gsap.utils.toArray(".slider-section .inner-container");
const miniItems = gsap.utils.toArray(".slider-mini-item");
const miniItemsBg = gsap.utils.toArray(".slider-mini-item .bg");
const miniItemsBgContainer = gsap.utils.toArray(
  ".slider-mini-item .inner-container"
);
const text = gsap.utils.toArray(".slider-section .text");

let currentSection = -1;
let isAnimating = false;

const wrapIndex = (min, max, index) => {
  return gsap.utils.wrap(min, max, index);
};

const setAnimating = (value) => {
  isAnimating = value;
};

const animateSection = (index, direction) => {
  let getDirection = direction === -1 ? -1 : 1;

  index = wrapIndex(0, sections.length, index);

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

  if (currentSection >= 0) {
    animateSectionOut(
      timeline,
      text,
      bg,
      miniItemsBg,
      sections,
      miniItems,
      currentSection,
      getDirection
    );
  }

  currentSection = index;

  animateSectionIn(
    timeline,
    bg,
    miniItemsBg,
    bgContainer,
    miniItemsBgContainer,
    index,
    getDirection
  );
  animateText(timeline, text, index, getDirection);
};

const animateSectionOut = (
  timeline,
  text,
  bg,
  miniItemsBg,
  sections,
  miniItems,
  currentSection,
  getDirection
) => {
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
};

const animateSectionIn = (
  timeline,
  bg,
  miniItemsBg,
  bgContainer,
  miniItemsBgContainer,
  index,
  getDirection
) => {
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
};

const animateText = (timeline, text, index, getDirection) => {
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
  onDown: () => handleScroll(currentSection - 1, -1),
  onUp: () => handleScroll(currentSection + 1, 1),
  tolerance: 50,
  preventDefault: true,
});

animateSection(0, 1);
