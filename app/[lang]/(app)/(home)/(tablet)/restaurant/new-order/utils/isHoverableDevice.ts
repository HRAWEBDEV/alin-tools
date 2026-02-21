function isHoverable() {
 const canHover = window.matchMedia(
  '(hover: hover) and (pointer: fine)',
 ).matches;
 return canHover;
}

export { isHoverable };
