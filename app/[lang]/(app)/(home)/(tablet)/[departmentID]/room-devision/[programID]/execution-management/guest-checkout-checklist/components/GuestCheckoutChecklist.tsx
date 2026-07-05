import { Fragment } from 'react';
import { GuestCheckoutChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guest-checkout-checklist/dictionary';
import { type GuestCheckoutProps } from '../utils/guestCheckoutChecklistProps';
import GuestCheckoutCheckItem from './GuestCheckoutCheckItem';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { EditGuestCheckoutProps } from '../utils/editGuestCheckoutProps';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';

export default function GuestCheckoutChecklist({
 dic,
 checklist,
 editChecklist,
}: {
 dic: GuestCheckoutChecklistDictionary;
 checklist: GuestCheckoutProps;
 editChecklist: EditGuestCheckoutProps;
}) {
 if (checklist.isSuccess && !checklist.data?.pages.length) {
  return <NoItemFound />;
 }
 if (!checklist.isFetching && checklist.isError) {
  return <UnExpectedError />;
 }
 return (
  <div>
   {checklist.isFetching && <LinearLoading />}
   <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 pb-4'>
    {checklist.data?.pages.map((group, i) => (
     <Fragment key={i}>
      {group.rows.length ? (
       group.rows.map((item) => (
        <GuestCheckoutCheckItem
         checkoutItem={item}
         key={item.id}
         dic={dic}
         editChecklist={editChecklist}
        />
       ))
      ) : (
       <div className='col-span-full'>
        <NoItemFound />
       </div>
      )}
     </Fragment>
    ))}
   </div>
   {checklist.hasNextPage && (
    <div className='flex items-center justify-center mt-4'>
     <Button
      variant='outline'
      size='lg'
      disabled={checklist.isFetching}
      onClick={() => checklist.fetchNextPage()}
      className='text-primary border-primary font-medium'
     >
      {checklist.isFetching && <Spinner className='text-primary' />}
      {dic.info.loadMore}
     </Button>
    </div>
   )}
  </div>
 );
}
