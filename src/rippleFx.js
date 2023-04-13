const animate = (circle) => {
  circle.classList.add("animate");
  circle.addEventListener("animationend", () => {
    circle.remove();
  });
};

const rippleFx = (button) => {
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  const pos = button.getBoundingClientRect();
  const center = {
    x: event.clientX - pos.left - radius,
    y: event.clientY - pos.top - radius,
  };

  circle.classList.add("circle");
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${center.x}px`;
  circle.style.top = `${center.y}px`;
  button.appendChild(circle);

  animate(circle);

  requestAnimationFrame(animate);
};

export { rippleFx };
