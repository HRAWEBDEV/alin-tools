export const handleScroll = ({
 ref,
 block = 'start',
}: {
 ref: React.RefObject<HTMLDivElement | null> | null;
 block?: 'start' | 'center' | 'end' | 'nearest';
}) => {
 ref?.current?.scrollIntoView({
  behavior: 'smooth',
  block: block,
 });
};
