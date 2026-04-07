import { RoomControlStep } from '../../services/room-control/roomControlApiActions';
const roomControlSteps: { title: RoomControlStep }[] = [
 {
  title: 'alert',
 },
 {
  title: 'checkNow',
 },
 {
  title: 'miniBar',
 },
 {
  title: 'checkRoom',
 },
] as const;

function getRoomControlStyles(stepTitle: RoomControlStep) {
 switch (stepTitle) {
  case 'miniBar':
   return {
    text: 'text-teal-700 dark:text-teal-400',
    indicator: 'bg-teal-400 dark:bg-teal-600',
    bg: 'bg-teal-50 dark:bg-teal-950',
   };
  case 'checkNow':
   return {
    text: 'text-sky-700 dark:text-sky-400',
    indicator: 'bg-sky-400 dark:bg-sky-600',
    bg: 'bg-sky-50 dark:bg-sky-950',
   };
  case 'checkRoom':
   return {
    text: 'text-teal-700 dark:text-teal-400',
    indicator: 'bg-teal-400 dark:bg-teal-600',
    bg: 'bg-teal-50 dark:bg-teal-950',
   };
 }
 return {
  text: 'text-red-700 dark:text-red-400',
  indicator: 'bg-red-400 dark:bg-red-600',
  bg: 'bg-red-50 dark:bg-red-950',
 };
}

export type { RoomControlStep };
export { roomControlSteps, getRoomControlStyles };
