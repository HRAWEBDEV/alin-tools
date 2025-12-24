export const handleScroll = (
 ref: React.RefObject<HTMLDivElement | null> | null
) => {
 ref?.current?.scrollIntoView({
  behavior: 'smooth',
  block: 'start',
 });
};
