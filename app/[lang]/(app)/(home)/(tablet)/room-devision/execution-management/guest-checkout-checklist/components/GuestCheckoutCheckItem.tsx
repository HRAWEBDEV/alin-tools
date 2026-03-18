import { type GuestCheckoutChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guest-checkout-checklist/dictionary';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { CheckoutChecklist } from '../services/guestCheckoutChecklistApiActions';
import { type EditGuestCheckoutProps } from '../utils/editGuestCheckoutProps';
import { MdTouchApp } from 'react-icons/md';

export default function GuestCheckoutCheckItem({
 dic,
 checkoutItem,
 editChecklist,
}: {
 dic: GuestCheckoutChecklistDictionary;
 editChecklist: EditGuestCheckoutProps;
 checkoutItem: CheckoutChecklist;
}) {
 const { locale } = useBaseConfig();

 return (
  <>
   <button
    className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 relative isolate'
    onClick={() => editChecklist.onShowEdit(checkoutItem.id)}
   >
    <div className='absolute bottom-0 end-0 -z-1 opacity-60'>
     <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
    </div>
    <div className='flex flex-wrap justify-between gap-1 mb-2'>
     <div>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.info.room}:{' '}
      </span>
      <span className='font-medium text-lg'>{checkoutItem.roomLabel}</span>
     </div>
     <div>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.info.registerNo}:{' '}
      </span>
      <span className='font-medium'>{checkoutItem.folioNo}</span>
     </div>
    </div>
    <div className='mb-1 flex items-center justify-between gap-2 whitespace-nowrap'>
     <p className='text-base mb-1 font-medium text-neutral-700 dark:text-neutral-400 text-start grow overflow-hidden text-ellipsis'>
      {checkoutItem.maidFullName}
     </p>
    </div>
    {/*<div className='mb-1 flex items-center justify-between gap-2 whitespace-nowrap'>
     <p className='text-base mb-1 font-medium text-destructive/70 text-start grow overflow-hidden text-ellipsis'>
      {room.reasonName}
     </p>
    </div>*/}
    <div className='flex flex-wrap gap-1 justify-between'>
     <span className='text-secondary/80'>
      {new Date(checkoutItem.dateTimeDateTimeOffset).toLocaleDateString(locale)}
     </span>
    </div>
   </button>
  </>
 );
}
