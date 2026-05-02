import {
 type RoomControlStep,
 getRoomControlStyles,
} from '../../utils/room-control/roomControl';
import { HouseControlStates } from '../../utils/room-control/houseControlStates';
import { type RoomControlDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/room-control/dictionary';

export default function RoomControlIndicator({
 hkStateID,
 dic,
 withText = false,
}: {
 hkStateID: number;
 dic: RoomControlDictionary;
 withText?: boolean;
}) {
 let stepPassed = hkStateID;
 if (hkStateID === 3) {
  stepPassed = 4;
 } else if (hkStateID === 4) {
  stepPassed = 3;
 }
 const stepPassedName = HouseControlStates[stepPassed] as RoomControlStep;
 return (
  <div className='p-0.5 bg-background flex gap-0.5 rounded-3xl px-1 items-center'>
   {Array.from({ length: 4 }, (_, i) => i + 1).map((i) => {
    const step = HouseControlStates[i] as RoomControlStep;
    const stepStyles = getRoomControlStyles(step);
    const activeStyle = stepPassed >= i;
    return (
     <div
      key={i}
      className={`size-3 rounded-full bg-neutral-300 dark:bg-neutral-700 ${activeStyle ? `${stepStyles.indicator}` : ''}`}
     ></div>
    );
   })}
   {withText && (
    <span className='ms-2 text-sm text-neutral-800 dark:text-neutral-400'>
     {dic.houseControl[stepPassedName]}
    </span>
   )}
  </div>
 );
}
