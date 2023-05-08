import { gsap } from "gsap";
import { Observer } from "gsap/Observer";

const sliderSectionSelector = ".slider-section";
const miniItemSelector = ".slider-mini-item";
const bgSelector = `${sliderSectionSelector} .bg`;
const bgContainerSelector = `${sliderSectionSelector} .inner-container`;
const miniItemBgSelector = `${miniItemSelector} .bg`;
const miniItemBgContainerSelector = `${miniItemSelector} .inner-container`;

const sections = gsap.utils.toArray(sliderSectionSelector);
const bg = gsap.utils.toArray(bgSelector);
const bgContainer = gsap.utils.toArray(bgContainerSelector);
const miniItems = gsap.utils.toArray(miniItemSelector);
const miniItemsBg = gsap.utils.toArray(miniItemBgSelector);
const miniItemsBgContainer = gsap.utils.toArray(miniItemBgContainerSelector);
const text = gsap.utils.toArray(`${sliderSectionSelector} .text`);

const sectionsAnimation = () => {
  gsap.registerPlugin(Observer);

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
    
    gsap.set(miniItems, { opacity: 1 });

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
    timeline
      .to([bg[currentSection], text[currentSection], miniItemsBg[currentSection]], {
        yPercent: -50 * getDirection,
      })
      .to(text[currentSection], {
        autoAlpha: 0,
        delay: -1.5,
      })      
      .set([sections[currentSection], miniItems[currentSection], text[currentSection]], {
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

    .to(text[index], {
      autoAlpha: 1,
      yPercent: 0,
      delay: -1.5,
    })      
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
};

export {sectionsAnimation};