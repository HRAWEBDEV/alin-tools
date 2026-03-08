import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { useRackConfigContext } from '../../services/rooms-rack-config/roomsRackConfigContext';

export default function RackInfo({ dic }: { dic: RoomsRackDictionary }) {
 const { rackInfo } = useRackConfigContext();
 return (
  <div className='p-4 pt-2'>
   <div className='grid grid-cols-1 gap-2 border-b border-input pb-2 mb-2 text-sm'>
    <div className='font-medium'>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.info.occupiedRooms}:{' '}
     </span>
     <span>{rackInfo.data?.occupied}</span>
    </div>
    <div className='font-medium'>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.info.vacantRooms}:{' '}
     </span>
     <span>{rackInfo.data?.vacent}</span>
    </div>
    <div className='font-medium'>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.info.readyRooms}:{' '}
     </span>
     <span>{rackInfo.data?.readyToService}</span>
    </div>
    <div className='font-medium'>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.info.outOfServiceRooms}:{' '}
     </span>
     <span>{rackInfo.data?.waiteForService}</span>
    </div>
    <div className='font-medium flex gap-1'>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.info.waitForQC}:{' '}
     </span>
     <span>{rackInfo.data?.waiteForQC}</span>
    </div>
    <div className='font-medium flex gap-1'>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.info.outOfOrderRooms}:{' '}
     </span>
     <span>{rackInfo.data?.outOfOrder}</span>
    </div>
   </div>
   <div className='grid grid-cols-1 gap-2 border-b border-input pb-2 mb-2 text-sm'>
    <div className='font-medium flex gap-1'>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.info.todayCheckin}:{' '}
     </span>
     <span>{rackInfo.data?.todayCheckin}</span>
    </div>
    <div className='font-medium flex gap-1'>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.info.registered}:{' '}
     </span>
     <span>{rackInfo.data?.todayCheckedin}</span>
    </div>
    <div className='font-medium flex gap-1'>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.info.notRegistered}:{' '}
     </span>
     <span>{rackInfo.data?.notCheckin}</span>
    </div>
   </div>
   <div className='grid grid-cols-1 gap-2 border-b border-input pb-2 mb-2 text-sm'>
    <div className='font-medium flex gap-1'>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.info.todayCheckout}:{' '}
     </span>
     <span>{rackInfo.data?.todayCheckout}</span>
    </div>
    <div className='font-medium flex gap-1'>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.info.checkout}:{' '}
     </span>
     <span>{rackInfo.data?.todayCheckedout}</span>
    </div>
    <div className='font-medium flex gap-1'>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.info.notCheckout}:{' '}
     </span>
     <span>{rackInfo.data?.notCheckout}</span>
    </div>
   </div>
   <div className='grid grid-cols-1 gap-2 text-sm'>
    <div className='font-medium flex gap-1'>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.info.guestsCount}:{' '}
     </span>
     <span>{rackInfo.data?.guestCout}</span>
    </div>
    <div className='font-medium flex gap-1'>
     <span className='text-neutral-600 dark:text-neutral-400'>
      {dic.info.extraBedsCount}:{' '}
     </span>
     <span>{rackInfo.data?.extraBed}</span>
    </div>
   </div>
  </div>
 );
}
