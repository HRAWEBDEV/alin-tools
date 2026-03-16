type RoomControlStep = (typeof roomControlSteps)[number];

const roomControlSteps = [
 {
  title: 'houseKeepingControl',
 },
 {
  title: 'underControl',
 },
 {
  title: 'minibarControl',
 },
 {
  title: 'roomControl',
 },
] as const;

function getRoomControlStyles(stepTitle: RoomControlStep['title']) {
 switch (stepTitle) {
  case 'minibarControl':
   return {
    text: 'text-teal-700 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950',
   };
  case 'underControl':
   return {
    text: 'text-sky-700 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950',
   };
  case 'roomControl':
   return {
    text: 'text-teal-700 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950',
   };
 }
 return {
  text: 'text-red-700 dark:text-red-400',
  bg: 'bg-red-50 dark:bg-red-950',
 };
}

export type { RoomControlStep };
export { roomControlSteps, getRoomControlStyles };
