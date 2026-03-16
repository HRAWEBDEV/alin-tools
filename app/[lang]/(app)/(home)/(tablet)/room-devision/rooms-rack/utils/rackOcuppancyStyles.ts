export function getRackOccupancyStyles(rate: number) {
 if (rate <= 20)
  return {
   text: 'text-red-700',
  };
 if (rate <= 40)
  return {
   text: 'text-red-500',
  };
 if (rate <= 60)
  return {
   text: 'text-orange-500',
  };
 if (rate <= 80)
  return {
   text: 'text-teal-500',
  };
 if (rate <= 100)
  return {
   text: 'text-teal-700',
  };
 return {
  text: 'text-teal-700',
 };
}
