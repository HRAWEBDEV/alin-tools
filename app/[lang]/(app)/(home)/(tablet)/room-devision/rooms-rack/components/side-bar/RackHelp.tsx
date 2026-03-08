import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 RoomStateKind,
 RoomInOutState,
 RoomStateType,
 roomInOutStates,
 roomStateKinds,
 roomStateTypes,
 getRackStatesStyles,
} from '../../utils/rackStates';
import {
 getStateKindIcon,
 getRoomInOutIcon,
 getStateTypeIcon,
} from '../../utils/rackStatesIcon';
import { Fragment } from 'react';

export default function RackHelp({ dic }: { dic: RoomsRackDictionary }) {
 return (
  <div>
   <div>
    <p className='p-2 text-center text-neutral-600 dark:text-neutral-400 font-medium border-y border-input bg-neutral-100 dark:bg-neutral-900 text-sm'>
     {dic.help.serviceState}
    </p>
    <ul className='px-4 py-2 grid gap-2'>
     {roomStateKinds.map((state) => (
      <Fragment key={state}>
       {state === 'readyToService' ? null : (
        <li className='flex gap-2 items-center'>
         <div dir='ltr' className={`${getRackStatesStyles().get(state)?.text}`}>
          {getStateKindIcon(RoomStateKind[state], {
           fontSize: '1.9rem',
           width: '1.9rem',
           height: '1.9rem',
           fill: 'currentColor',
          })}
         </div>
         <div className='text-neutral-700 dark:text-neutral-400 text-sm'>
          {dic.help[state]}
         </div>
        </li>
       )}
      </Fragment>
     ))}
    </ul>
   </div>
   <div>
    <p className='p-2 text-center text-neutral-600 dark:text-neutral-400 font-medium border-y border-input bg-neutral-100 dark:bg-neutral-900 text-sm'>
     {dic.help.roomStateInOutStateState}
    </p>
    <ul className='px-4 py-2 grid gap-2'>
     {roomInOutStates.map((state) => (
      <li key={state} className='flex gap-2 items-center'>
       <div dir='ltr' className={`${getRackStatesStyles().get(state)?.text}`}>
        {getRoomInOutIcon(RoomInOutState[state], {
         fontSize: '1.9rem',
         width: '1.9rem',
         height: '1.9rem',
         fill: 'currentColor',
        })}
       </div>
       <div className='text-neutral-700 dark:text-neutral-400 text-sm'>
        {dic.help[state]}
       </div>
      </li>
     ))}
    </ul>
   </div>
   <div>
    <p className='p-2 text-center text-neutral-600 dark:text-neutral-400 font-medium border-y border-input bg-neutral-100 dark:bg-neutral-900 text-sm'>
     {dic.help.roomStateKind}
    </p>
    <ul className='px-4 py-2 grid gap-2'>
     {roomStateTypes.map((state) => (
      <li key={state} className='flex gap-2 items-center'>
       <div dir='ltr'>
        {getStateTypeIcon(RoomStateType[state], {
         fontSize: '1.9rem',
         width: '1.9rem',
         height: '1.9rem',
         fill: 'currentColor',
        })}
       </div>
       <div className='text-neutral-700 dark:text-neutral-400 text-sm'>
        {dic.help[state]}
       </div>
      </li>
     ))}
    </ul>
   </div>
  </div>
 );
}
