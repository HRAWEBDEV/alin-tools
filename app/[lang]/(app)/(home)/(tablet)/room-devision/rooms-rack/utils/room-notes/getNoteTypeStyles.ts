import { NoteTypes } from './noteTypes';

const defaultStyles = {
 text: 'text-destructive',
 bg: 'bg-red-100 bg:text-red-900',
};

export function getNoteTypeStyles(messageTypeID: number | null) {
 if (!messageTypeID) {
  return defaultStyles;
 }
 switch (messageTypeID) {
  case NoteTypes.normal:
   return {
    text: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-100 bg:text-yellow-900',
   };
  case NoteTypes.important:
   return {
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 bg:text-red-900',
   };
  case NoteTypes.veryImportant:
   return {
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 bg:text-red-900',
   };
  case NoteTypes.urgent:
   return {
    text: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 bg:text-purple-900',
   };
  case NoteTypes.onCheckout:
   return {
    text: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-100 bg:text-sky-900',
   };
 }
 return defaultStyles;
}
