import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { type RoomGuest } from '../../services/guests/roomGuestsApiActions';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
// import { MdTouchApp } from 'react-icons/md';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { FaCheck } from 'react-icons/fa';

export default function RoomGuestsList({
 dic,
 isError,
 isFetching,
 isSuccess,
 data,
}: {
 dic: RoomsRackDictionary;
 data?: RoomGuest[];
 isError: boolean;
 isSuccess: boolean;
 isFetching: boolean;
}) {
 const { locale } = useBaseConfig();
 if (isSuccess && !data?.length) {
  return <NoItemFound />;
 }
 if (!isFetching && isError) {
  return <UnExpectedError />;
 }
 return (
  <div>
   {isFetching && <LinearLoading />}
   <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
    {data?.map((guest) => (
     <button
      key={guest.id}
      className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 isolate relative'
     >
      {/*<div className='absolute bottom-0 end-6 -z-1 opacity-60'>
       <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
      </div>*/}
      <div className='flex flex-wrap justify-between gap-1 mb-1'>
       <div>
        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
         {dic.roomGuests.roomNumber}:{' '}
        </span>
        <span className='font-medium text-lg'>{guest.roomLabel}</span>
       </div>
       <div>
        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
         {dic.roomGuests.registrationNumber}:{' '}
        </span>
        <span className='font-medium text-lg'>{guest.folioNo}</span>
       </div>
      </div>
      <div className='flex flex-wrap justify-between gap-1 mb-2'>
       <div>
        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
         {dic.roomGuests.firstName}:{' '}
        </span>
        <span className='font-medium'>{guest.firstName}</span>
       </div>
      </div>
      <div className='flex flex-wrap justify-between gap-1 mb-2'>
       <div>
        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
         {dic.roomGuests.lastName}:{' '}
        </span>
        <span className='font-medium'>{guest.lastName}</span>
       </div>
      </div>
      <div className='flex flex-wrap justify-between gap-1 mb-2'>
       <div>
        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
         {dic.roomGuests.gender}:{' '}
        </span>
        <span>{guest.genderName}</span>
       </div>
      </div>
      <div className='flex flex-wrap justify-between gap-1 mb-2'>
       <div>
        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
         {dic.roomGuests.nationality}:{' '}
        </span>
        <span>{guest.nationalityName}</span>
       </div>
      </div>
      <div className='flex flex-wrap justify-between gap-1 mb-2'>
       <div>
        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
         {dic.roomGuests.nationalCode}:{' '}
        </span>
        <span>{guest.nationalCode}</span>
       </div>
      </div>
      <div className='flex flex-wrap justify-between gap-1 mb-2'>
       <div>
        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
         {dic.roomGuests.priceType}:{' '}
        </span>
        <span>{guest.extraRateTypeName}</span>
       </div>
      </div>
      <div className='flex flex-wrap justify-between gap-1 mb-2 items-center'>
       <div>
        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
         {dic.roomGuests.checkinDate}:{' '}
        </span>
        <span className='text-secondary'>
         {new Date(guest.checkinDateTimeOffset).toLocaleDateString(locale)}
        </span>
       </div>
      </div>
      <div className='flex flex-wrap justify-between gap-1 mb-2 items-center'>
       <div>
        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
         {dic.roomGuests.checkoutDate}:{' '}
        </span>
        <span className='text-destructive'>
         {guest.checkoutDateTimeOffset
          ? new Date(guest.checkoutDateTimeOffset).toLocaleDateString(locale)
          : '---'}
        </span>
       </div>
      </div>
      <div className='flex flex-wrap justify-between gap-1 mb-1'>
       <div className='flex items-center gap-1'>
        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
         {dic.roomGuests.master}:{' '}
        </span>
        <FaCheck
         className={`text-secondary size-5 ${guest.isMaster ? '' : 'opacity-0'}`}
        />
       </div>
       <div className='flex items-center gap-1'>
        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
         {dic.roomGuests.folioOwner}:{' '}
        </span>
        <FaCheck
         className={`text-secondary size-5 ${guest.isFolioOwner ? '' : 'opacity-0'}`}
        />
       </div>
      </div>
     </button>
    ))}
   </div>
  </div>
 );
}
