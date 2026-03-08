import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { type Rack } from '../../services/roomsRackApiActions';
import { motion } from 'motion/react';

export default function RackRoom({
 dic,
 room,
}: {
 dic: RoomsRackDictionary;
 room: Rack;
}) {
 return (
  <motion.div layout className='grid group'>
   <div className='relative min-h-40 group-data-[layout-minimal="true"]:min-h-auto'>
    <Button
     variant={'outline'}
     className='z-1 rounded-2xl h-full flex-col justify-start text-start p-0 overflow-hidden shadow-lg group-data-[layout-minimal="true"]:mx-0 group-data-[layout-minimal="true"]:w-full'
     asChild
    >
     <Link href='#' className='relative flex! flex-col grow items-stretch p-2'>
      <div className='p-1 rounded-2xl border border-dashed text-center'>
       <span className='text-base font-medium'>
        <span>---</span>
        ---
       </span>
      </div>
      <div className='text-start ps-2 grow'>
       <div className='flex items-center gap-2'>
        <h3 className='text-2xl lg:text-3xl font-en-roboto'>
         {room.roomLabel.padStart(2, '0')}
        </h3>
       </div>
       <div>
        <p className='text-sm text-primary text-wrap group-data-[bold=true]:font-medium'>
         ---
        </p>
        <p className='text-md text-neutral-500 dark:text-neutral-400 text-wrap group-data-[bold=true]:font-medium'>
         ---
        </p>
       </div>
      </div>
      <div className='flex items-center justify-between gap-4'>
       <div className='flex items-center gap-1 text-base text-neutral-600 dark:text-neutral-400 font-medium group-data-[bold=true]:font-bold'>
        <span>---</span>
       </div>
       <div
        style={{
         direction: 'ltr',
        }}
        className='font-medium text-base'
       >
        ---
       </div>
      </div>
     </Link>
    </Button>
   </div>
  </motion.div>
 );
}
