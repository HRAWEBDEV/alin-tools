enum RoomStateKind {
 readyToService = 1,
 waitingForQC,
 notCleaned,
 outOfService,
 transferGuest,
}

enum RoomInOutState {
 todayCheckin = 1,
 todayWaitForCheckin,
 todayCheckout,
 todayWaitForCheckout,
 overStay = 7,
}

enum RoomStateType {
 default = 1,
 checkHouseKeeper,
 waitForBooking,
 waitForCheckin,
 noShow,
 DND,
 noLuggage,
 lightLuggage,
 sleptOut,
 houseUse,
 locked,
}

enum RoomStateGroup {
 reservedOrEmptyRoom = 1,
 occupiedRoom,
}

function getRackStatesStyles() {
 const rackStatesStyles = new Map<
  | keyof typeof RoomInOutState
  | keyof typeof RoomStateKind
  | keyof typeof RoomStateGroup
  | 'userDefaultColor'
  | 'occupiedCustomer'
  | 'waitForCheckin'
  | 'transferGuest',
  {
   border: string;
   text: string;
   backgoundColor: string;
  }
 >([
  [
   'todayCheckin',
   {
    border: '',
    backgoundColor: '',
    text: 'text-teal-700 dark:text-teal-400',
   },
  ],
  [
   'todayWaitForCheckin',
   {
    border: '',
    backgoundColor: '',
    text: 'text-sky-700 dark:text-sky-400',
   },
  ],
  [
   'waitForCheckin',
   {
    border: '',
    backgoundColor: '',
    text: 'text-red-700 dark:text-red-400',
   },
  ],
  [
   'todayCheckout',
   {
    border: '',
    backgoundColor: '',
    text: 'text-teal-700 dark:text-teal-400',
   },
  ],
  [
   'todayWaitForCheckout',
   {
    border: '',
    backgoundColor: '',
    text: 'text-red-700 dark:text-red-400',
   },
  ],
  [
   'transferGuest',
   {
    border: '',
    backgoundColor: '',
    text: 'text-red-900 dark:text-red-300',
   },
  ],
  [
   'readyToService',
   {
    border: '',
    backgoundColor: '',
    text: 'text-[#1C2836] dark:text-neutral-400',
   },
  ],
  [
   'waitingForQC',
   {
    border: '',
    backgoundColor: '',
    text: 'text-[#0383c5]',
   },
  ],
  [
   'notCleaned',
   {
    border: '',
    backgoundColor: '',
    text: 'text-[#B96205]',
   },
  ],
  [
   'outOfService',
   {
    border: '',
    backgoundColor: '',
    text: 'text-red-700 dark:text-red-400',
   },
  ],
  [
   'reservedOrEmptyRoom',
   {
    border: '',
    backgoundColor: '',
    text: 'text-teal-700 dark:text-teal-400',
   },
  ],
  [
   'userDefaultColor',
   {
    border: '',
    backgoundColor: '',
    text: 'text-sky-900 dark:text-sky-400',
   },
  ],
  [
   'occupiedCustomer',
   {
    border: '',
    backgoundColor: '',
    text: 'text-[#E75A26]',
   },
  ],
  [
   'overStay',
   {
    border: '',
    backgoundColor: '',
    text: 'text-rose-600 dark:text-rose-300',
   },
  ],
 ]);
 return rackStatesStyles;
}

export {
 RoomInOutState,
 RoomStateGroup,
 RoomStateKind,
 RoomStateType,
 getRackStatesStyles,
};
