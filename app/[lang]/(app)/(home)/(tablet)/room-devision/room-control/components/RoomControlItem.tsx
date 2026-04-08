import { type RoomControlPageDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/room-control/dictionary';
import { Button } from '@/components/ui/button';
import { type RoomControl } from '../services/roomControlApiActions';
import { type EditRoomControlProps } from '../utils/editRoomControlProps';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function RoomControlItem({
 dic,
 roomControl,
 editRoomControlProps,
}: {
 dic: RoomControlPageDictionary;
 roomControl: RoomControl;
 editRoomControlProps: EditRoomControlProps;
}) {
 return (
  <motion.div layout className='grid group'>
   <div className='relative min-h-auto'>
    <Button
     variant={'outline'}
     className="z-1 rounded-2xl h-full flex-col justify-start text-start p-0 overflow-hidden shadow-lg [&_svg:not([class*='size-'])]:size-[unset]"
     asChild
    >
     <Link
      href='#'
      className={`relative flex! flex-col grow items-stretch p-2`}
     >
      <div className={`rounded-2xl border border-dashed text-center p-0`}></div>
      <div className='text-start grow ps-0 pb-1'>
       <div className='flex items-center justify-center gap-1'>
        <h3
         className={`text-2xl lg:text-3xl group-data-[layout-minimal=true]:text-2xl font-en-roboto`}
        >
         {roomControl.roomLabel.padStart(2, '0')}
        </h3>
       </div>
      </div>
     </Link>
    </Button>
   </div>
  </motion.div>
 );
}
