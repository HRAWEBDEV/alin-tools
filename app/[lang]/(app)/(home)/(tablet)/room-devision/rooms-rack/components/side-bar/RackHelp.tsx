import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';

export default function RackHelp({ dic }: { dic: RoomsRackDictionary }) {
 return (
  <div>
   <div>
    <p className='p-2 text-center text-neutral-600 dark:text-neutral-400 font-medium border-b border-input bg-neutral-100 dark:bg-neutral-900'>
     {dic.filters.serviceState}
    </p>
   </div>
   <div>
    <p className='p-2 text-center text-neutral-600 dark:text-neutral-400 font-medium border-b border-input bg-neutral-100 dark:bg-neutral-900'>
     {dic.filters.roomStateInOutStateState}
    </p>
   </div>
   <div>
    <p className='p-2 text-center text-neutral-600 dark:text-neutral-400 font-medium border-b border-input bg-neutral-100 dark:bg-neutral-900'>
     {dic.filters.roomStateKind}
    </p>
   </div>
  </div>
 );
}
