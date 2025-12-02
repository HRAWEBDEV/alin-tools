enum TableStateTypes {
 readyToService = 1,
 outOfService,
 reserved,
 regularCustomer,
 VIPCustomer,
 roomGuest,
}

function getTableStateStyles(state: TableStateTypes): {
 type: 'readyToService' | 'outOfService' | 'reserved' | 'occupied';
 border: string;
 text: string;
 backgoundColor: string;
} {
 switch (state) {
  case 1:
   return {
    type: 'readyToService',
    border: 'border-teal-600 dark:border-teal-400',
    text: 'text-teal-600 dark:text-teal-400',
    backgoundColor: 'bg-teal-50 dark:bg-teal-950',
   };
  case 2:
   return {
    type: 'outOfService',
    border: '',
    text: '',
    backgoundColor: '',
   };
  case 3:
   return {
    type: 'reserved',
    border: 'border-amber-600 dark:border-amber-400',
    text: 'text-amber-600 dark:text-amber-400',
    backgoundColor: 'bg-amber-50 dark:bg-amber-950',
   };
  case 4:
   return {
    type: 'occupied',
    border: '',
    text: '',
    backgoundColor: '',
   };
  case 5:
   return {
    type: 'occupied',
    border: '',
    text: '',
    backgoundColor: '',
   };
  case 6:
   return {
    type: 'occupied',
    border: '',
    text: '',
    backgoundColor: '',
   };
 }
 return {
  type: 'outOfService',
  border: '',
  text: '',
  backgoundColor: '',
 };
}

export type { TableStateTypes };
export { getTableStateStyles };
