'use client';

import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';

import GuestsFilters from './GuestsFilters';
import GuestsList from './GuestsList';
import GuestDetailDrawer from './GuestDetailDrawer';
import {
 getResidentGuests,
 getInitialData,
 ResidentGuest,
} from '../services/guestsListApiActions';
import { useDebounce } from '../../../hooks/useDebounce';
import { type ResidentGuestsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/resident-guests/dictionary';

export type GuestsFilterForm = {
 folio?: string;
 reserveNo?: string;
 nationality?: string | null;
 specialGuest?: string | null;
 group?: string | null;
 room?: string | null;
};

const PAGE_SIZE = 50;

export default function GuestsListWrapper({
 dic,
}: {
 dic: ResidentGuestsDictionary;
}) {
 const methods = useForm<GuestsFilterForm>({
  defaultValues: {
   folio: '',
   reserveNo: '',
   nationality: null,
   specialGuest: null,
   group: null,
   room: null,
  },
 });

 const filters = useWatch({ control: methods.control });
 const [selectedGuest, setSelectedGuest] = useState<ResidentGuest | null>(null);
 const [page, setPage] = useState(1);

 const initData = useQuery({
  queryKey: ['guestsInitialData'],
  queryFn: ({ signal }) => getInitialData(signal),
 });
 const debouncedFilters = useDebounce(filters, 500);
 const guests = useQuery({
  queryKey: ['residentGuests', debouncedFilters],
  queryFn: ({ signal }) => {
   const queryValues = {
    folioNo: filters.folio ? [filters.folio] : undefined,
    reserveNo: filters.reserveNo ? [filters.reserveNo] : undefined,
    nationalityID: filters.nationality ? [filters.nationality] : undefined,
    roomID: filters.room ? [filters.room] : undefined,
    vipGuestTypeID: filters.specialGuest ? [filters.specialGuest] : undefined,
    customerID: filters.group ? [filters.group] : undefined,
   };
   return getResidentGuests(signal, queryValues);
  },
  enabled: !!initData.data,
 });
 const numGuests = guests.data?.data.guestsCount;
 const paginatedGuests = useMemo(() => {
  const allGuests = guests.data?.data.residentGuests || [];
  return allGuests.slice(0, page * PAGE_SIZE);
 }, [guests.data, page]);

 const hasMore = useMemo(() => {
  const total = guests.data?.data.residentGuests.length || 0;
  return page * PAGE_SIZE < total;
 }, [guests.data, page]);

 return (
  <FormProvider {...methods}>
   <div className='flex flex-col gap-2 h-full'>
    <GuestsFilters
     dic={dic}
     numGuests={numGuests}
     initData={initData.data?.data}
     initDataIsLoading={initData.isLoading}
    />
    <GuestsList
     dic={dic}
     guests={paginatedGuests}
     isLoading={guests.isLoading}
     isFetching={guests.isFetching}
     isError={guests.isError}
     hasMore={hasMore}
     onLoadMore={() => setPage((p) => p + 1)}
     onSelectGuest={setSelectedGuest}
    />
    <GuestDetailDrawer
     dic={dic}
     guest={selectedGuest}
     onClose={() => setSelectedGuest(null)}
    />
   </div>
  </FormProvider>
 );
}
