type RoomState = (typeof roomStates)[number];

enum RoomStateKind {
 readyToService = 1,
 waitingForQC,
 notCleaned,
 outOfService,
 transferGuest,
}

const roomStateKinds = Object.keys(RoomStateKind).filter(
 (item) => !Number(item),
) as readonly (keyof typeof RoomStateKind)[];

enum RoomInOutState {
 todayCheckin = 1,
 todayWaitForCheckin,
 todayCheckout,
 todayWaitForCheckout,
 overStay = 7,
}

const roomInOutStates = Object.keys(RoomInOutState).filter(
 (item) => !Number(item),
) as readonly (keyof typeof RoomInOutState)[];

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

const roomStateTypes = Object.keys(RoomStateType).filter(
 (item) => !Number(item),
) as readonly (keyof typeof RoomStateType)[];

enum RoomStateGroup {
 reservedOrEmptyRoom = 1,
 occupiedRoom,
}

const roomStates = [
 'emptyRoom',
 'reservedRoom',
 'closedRoom',
 'occupiedRoom',
 'occupiedCustomerRoom',
 'dayUse',
] as const;

function getRackStatesStyles() {
 const rackStatesStyles = new Map<
  | keyof typeof RoomInOutState
  | keyof typeof RoomStateKind
  | keyof typeof RoomStateGroup
  | 'userDefaultColor'
  | 'occupiedCustomer'
  | 'waitForCheckin'
  | 'transferGuest'
  | (typeof roomStates)[number]
  | 'none',
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
  [
   'reservedRoom',
   {
    border: 'border-teal-600 dark:border-teal-300',
    backgoundColor: 'bg-teal-50 dark:bg-teal-950',
    text: 'text-teal-600 dark:text-teal-300',
   },
  ],
  [
   'occupiedRoom',
   {
    border: 'border-sky-600 dark:border-sky-300',
    backgoundColor: 'bg-sky-50 dark:bg-sky-950',
    text: 'text-sky-600 dark:text-sky-300',
   },
  ],
  [
   'dayUse',
   {
    border: 'border-sky-600 dark:border-sky-300',
    backgoundColor: 'bg-sky-50 dark:bg-sky-950',
    text: 'text-sky-600 dark:text-sky-300',
   },
  ],
  [
   'closedRoom',
   {
    border: 'border-sky-600 dark:border-sky-300',
    backgoundColor: 'bg-sky-50 dark:bg-sky-950',
    text: 'text-sky-600 dark:text-sky-300',
   },
  ],
  [
   'occupiedCustomerRoom',
   {
    border: 'border-orange-600 dark:border-orange-300',
    backgoundColor: 'bg-orange-50 dark:bg-orange-950',
    text: 'text-orange-600 dark:text-orange-300',
   },
  ],
  [
   'emptyRoom',
   {
    border: 'border-neutral-600 dark:border-neutral-300',
    backgoundColor: 'bg-neutral-100 dark:bg-neutral-900',
    text: 'text-neutral-600 dark:text-neutral-300',
   },
  ],
  [
   'none',
   {
    border: '',
    backgoundColor: '',
    text: '',
   },
  ],
 ]);
 return rackStatesStyles;
}

export type { RoomState };
export {
 RoomInOutState,
 RoomStateGroup,
 RoomStateKind,
 RoomStateType,
 roomInOutStates,
 roomStateKinds,
 roomStateTypes,
 roomStates,
 getRackStatesStyles,
};
