// Importamos las librerías necesarias
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";

// Registramos el plugin Observer en GSAP
gsap.registerPlugin(Observer);

// Creamos un objeto con las secciones y los elementos de fondo
const mySections = {
  sections: gsap.utils.toArray(".slider-section"),
  bg: gsap.utils.toArray(".slider-section .bg"),
  bgContainer: gsap.utils.toArray(".slider-section .inner-container"),
  miniItems: gsap.utils.toArray(".slider-mini-item"),
  miniItemsBg: gsap.utils.toArray(".slider-mini-item .bg"),
  miniItemsBgContainer: gsap.utils.toArray(".slider-mini-item .inner-container")  
}

// Inicializamos las variables que necesitamos para el control de la animación
let currentSection = -1;
let isAnimating = false;
let header = document.querySelector('.header')

// Función para envolver el índice de la sección
const wrapIndex = (min, max, index) => {
  return gsap.utils.wrap(min, max, index);
};

// Función para animar la transición entre secciones
const animateSection = (sectionsObj, index, direction) => {
  // Obtenemos las secciones y los elementos de fondo desde el objeto
  const sections = sectionsObj.sections;
  const bg = sectionsObj.bg;
  const bgContainer = sectionsObj.bgContainer;  
  const miniItems = sectionsObj.miniItems;
  const miniItemsBg = sectionsObj.miniItemsBg;
  const miniItemsBgContainer = sectionsObj.miniItemsBgContainer;


  // Envolvemos el índice de la sección
  index = wrapIndex(0, sections.length, index);
  
  // Indicamos que la animación está activa
  isAnimating = true;

  // Creamos una línea de tiempo para la animación
  const tl = gsap.timeline({
    defaults: {
      duration: 1.5,
      ease: "power3.out"
    },
    // Al terminar la animación, indicamos que ya no está activa
    onComplete: () => {
      isAnimating = false;
    }
  });  

  // Establecemos la propiedad zIndex de todas las secciones y miniaturas a 0
  gsap.set([sections, miniItems], { zIndex: 0 });
  // Establecemos la propiedad zIndex de la sección y miniatura activas a 1 y la propiedad autoAlpha a 1 para que sean visibles
  gsap.set([sections[index], miniItems[index]], { zIndex: 1, autoAlpha: 1 });

  // Obtenemos el valor de dirección para la animación
  let getDirection = direction === -1 ? -1 : 1

  // Si hay una sección activa actualmente, animamos el fondo de esa sección para que desaparezca y ocultamos la sección y miniatura correspondientes

  if (currentSection >= 0) {
    header.classList.remove('is-first');
    tl.to([bg[currentSection], miniItemsBg[currentSection]], { yPercent: -50 * getDirection })
      .set([sections[currentSection], miniItems[currentSection]], { autoAlpha: 0 })
  }
    
  // Asignamos la sección activa actual
  currentSection = index;
 
  if (index === 0) {
    header.classList.add('is-first');
  }

  // Animamos el fondo y el contenedor de la nueva sección para que aparezcan
  tl.fromTo([bg[index], miniItemsBg[index]], { yPercent: -50 * (getDirection) }, { yPercent: 0 }, 0)
    .fromTo([[bgContainer[index], miniItemsBgContainer[index]]], { yPercent: 100 * (getDirection) }, { yPercent: 0 }, 0)

  gsap.set(header, {opacity: 0});
  
  tl.fromTo(header, {opacity: 0}, {opacity: 1}, 0);
}

// Función para manejar el evento de scroll
const handleScroll = (sectionsObj, index, direction) => {
  // Si no está ocurriendo ninguna animación, llamamos a la función animateSection con los parámetros correspondientes

  if (!isAnimating) {

    animateSection(sectionsObj, index, direction);
  }
}

// Creamos un Observer para detectar eventos de scroll y llamar a la función handleScroll
Observer.create({
  type: "wheel,touch,pointer",
  wheelSpeed: -1,
  onDown: () => handleScroll(mySections, currentSection - 1, -1),
  onUp: () => handleScroll(mySections, currentSection + 1, 1),
  tolerance: 50,
  preventDefault: true
});

// Inicializamos la animación con la primera sección
animateSection(mySections, 0, 1);