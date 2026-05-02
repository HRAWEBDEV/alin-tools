import { NoteTypes } from './noteTypes';

const defaultStyles = {
 text: 'text-destructive',
};

export function getNoteTypeStyles(messageTypeID: number | null) {
 if (!messageTypeID) {
  return defaultStyles;
 }
 switch (messageTypeID) {
  case NoteTypes.normal:
   return {
    text: 'text-yellow-600 dark:text-yellow-400',
   };
  case NoteTypes.important:
   return {
    text: 'text-red-600 dark:text-red-400',
   };
  case NoteTypes.veryImportant:
   return {
    text: 'text-red-600 dark:text-red-400',
   };
  case NoteTypes.urgent:
   return {
    text: 'text-purple-600 dark:text-purple-400',
   };
  case NoteTypes.onCheckout:
   return {
    text: 'text-sky-600 dark:text-sky-400',
   };
 }
 return defaultStyles;
}
