'use client';
import { useState } from 'react';
import { type RoomStatisticsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/room-statistics/dictionary';
import { useQuery } from '@tanstack/react-query';
import {
 roomsRackBaseKey,
 getRoomsStatistics,
} from './services/roomsStatisticsApiaActions';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { ChevronDownIcon } from 'lucide-react';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { Field, FieldLabel } from '@/components/ui/field';
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useDateFns } from '@/hooks/useDateFns';

export default function RoomsStatisticsWrapper({
 dic,
}: {
 dic: RoomStatisticsDictionary;
}) {
 const { locale } = useBaseConfig();
 const dateFns = useDateFns();
 const [showDatePicker, setShowDatePicker] = useState(false);
 const [date, setDate] = useState<Date>(dateFns.startOfDay(new Date()));
 const { data, isLoading, isSuccess, isError } = useQuery({
  queryKey: [roomsRackBaseKey, 'all', date.toISOString()],
  async queryFn({ signal }) {
   const res = await getRoomsStatistics({
    signal,
    date: date.toISOString(),
   });
   return res.data;
  },
 });

 if (isError) return <UnExpectedError />;
 return (
  <div>
   {isLoading && <LinearLoading />}

   <div>
    <div className='grid gap-4 grid-cols-2 md:grid-cols-3 mb-2'>
     <Field className='gap-2'>
      <FieldLabel htmlFor='date'>{dic.date}</FieldLabel>
      <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
       <PopoverTrigger asChild>
        <Button
         variant='outline'
         id='orderDate'
         className='justify-between font-normal h-11'
        >
         <span>{date.toLocaleDateString(locale)}</span>
         <ChevronDownIcon />
        </Button>
       </PopoverTrigger>
       <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
        <Calendar
         mode='single'
         captionLayout='dropdown'
         className='[&]:[--cell-size:2.6rem]'
         selected={date}
         onSelect={(value) => {
          if (!value) return;
          setDate(value);
          setShowDatePicker(false);
         }}
        />
       </PopoverContent>
      </Popover>
     </Field>
    </div>
    <div className='grid gap-4 grid-cols-2 md:grid-cols-3'>
     {/* occupancy */}
     <div className='p-2 shadow-sm border border-input rounded-lg'>
      <h3 className='text-center font-medium rounded-lg p-2 border mb-2 bg-destructive/10 text-destructive border-destructive/50 text-base'>
       {dic.occupied.title}
      </h3>
      <div className='px-2 grid gap-1'>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.occupied.occupiedRoom}:{' '}
        </span>
        <span>{data?.occupiedRooms}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.occupied.emptyRoom}:{' '}
        </span>
        <span>{data?.vacantRooms}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.occupied.guestCount}:{' '}
        </span>
        <span>{data?.totalGuests}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.occupied.exBedCount}:{' '}
        </span>
        <span>{data?.totalExBed}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.occupied.occupencyPercentage}:{' '}
        </span>
        <span>{data?.occupiedPercentage}</span>
       </div>
      </div>
     </div>
     {/* arrival */}
     <div className='p-2 shadow-sm border border-input rounded-lg'>
      <h3 className='text-center font-medium rounded-lg p-2 border mb-2 bg-secondary/10 text-secondary border-secondary/50 text-base'>
       {dic.arrival.title}
      </h3>
      <div className='px-2 grid gap-1'>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.arrival.todayArrival}:{' '}
        </span>
        <span>{data?.todayIncoming}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.arrival.registered}:{' '}
        </span>
        <span>{data?.checkInCount}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.arrival.notRegistered}:{' '}
        </span>
        <span>{data?.notCheckInCount}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.arrival.earlyCheckin}:{' '}
        </span>
        <span>{data?.earlyCheckIn}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.arrival.guestCount}:{' '}
        </span>
        <span>{data?.checkInGuests}</span>
       </div>
      </div>
     </div>
     {/* status */}
     <div className='p-2 shadow-sm border border-input rounded-lg col-span-2 md:row-span-2 md:col-span-1'>
      <h3 className='text-center font-medium rounded-lg p-2 border mb-2 bg-orange-100 text-orange-600 border-orange-400 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-600 text-base'>
       {dic.arrival.title}
      </h3>
      <div className='px-2 grid gap-2'>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.status.awaitingReserve}:{' '}
        </span>
        <span>{data?.awaitingReservation}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.status.awaitingRegister}:{' '}
        </span>
        <span>{data?.awaitingRegistration}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.arrival.notRegistered}:{' '}
        </span>
        <span>{data?.notCheckInCount}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.status.withoutGuest}:{' '}
        </span>
        <span>{data?.withOutGuest}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.status.noDisturb}:{' '}
        </span>
        <span>{data?.doNotDisturb}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.status.lightLuggageGuest}:{' '}
        </span>
        <span>{data?.lightLuggage}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.status.noLuggageGuest}:{' '}
        </span>
        <span>{data?.noLuggage}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.status.noSleep}:{' '}
        </span>
        <span>{data?.sleptOut}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.status.hotelUse}:{' '}
        </span>
        <span>{data?.houseUse}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.status.locked}:{' '}
        </span>
        <span>{data?.lockeOut}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.status.locked}:{' '}
        </span>
        <span>{data?.lockeOut}</span>
       </div>
      </div>
     </div>
     {/* service */}
     <div className='p-2 shadow-sm border border-input rounded-lg'>
      <h3 className='text-center font-medium rounded-lg p-2 border mb-2 bg-purple-100 text-purple-600 border-purple-400 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-600 text-base'>
       {dic.service.title}
      </h3>
      <div className='px-2 grid gap-1'>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.service.serviceReady}:{' '}
        </span>
        <span>{data?.readyForService}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.service.awaitingQualityControl}:{' '}
        </span>
        <span>{data?.awaitingForQC}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.service.awaitingService}:{' '}
        </span>
        <span>{data?.awaitingForService}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.service.outofService}:{' '}
        </span>
        <span>{data?.outOfOrder}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.service.stopSale}:{' '}
        </span>
        <span>{data?.stopSell}</span>
       </div>
      </div>
     </div>
     {/* departure */}
     <div className='p-2 shadow-sm border border-input rounded-lg'>
      <h3 className='text-center font-medium rounded-lg p-2 border mb-2 bg-destructive/10 text-destructive border-destructive/50 text-base'>
       {dic.departure.title}
      </h3>
      <div className='px-2 grid gap-1'>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.departure.todayDeparture}:{' '}
        </span>
        <span>{data?.todayOutGoing}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.departure.checkout}:{' '}
        </span>
        <span>{data?.checkOutCount}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.departure.notCheckout}:{' '}
        </span>
        <span>{data?.notCheckOutCount}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.departure.earlyCheckout}:{' '}
        </span>
        <span>{data?.lateCheckOut}</span>
       </div>
       <div className='font-medium'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.departure.guestCount}:{' '}
        </span>
        <span>{data?.checkOutGuests}</span>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
