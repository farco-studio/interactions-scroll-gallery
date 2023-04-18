import { sectionsAnimation } from "./sectionsAnimation";
import { cursorComponent } from "./cursor";

const isMobile = window.matchMedia("(max-width: 768px)").matches;

const init = () => {
  sectionsAnimation();

  if (!isMobile) {
    cursorComponent();
  }
}

init();