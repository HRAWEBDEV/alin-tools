'use client';
import { useState } from 'react';
import { GuestCheckoutChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guest-checkout-checklist/dictionary';
import { useForm, FormProvider } from 'react-hook-form';
import {
 type CheckoutChecklistSchema,
 createCheckoutChecklistSchema,
 defaultValues,
} from './schemas/checkoutChecklistSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
 guestCheckoutChecklistBaseKey,
 getInitialData,
 getCheckoutChecklist,
} from './services/guestCheckoutChecklistApiActions';
import { useDateFns } from '@/hooks/useDateFns';
import GuestCheckoutChecklistFilters from './components/GuestCheckoutChecklistFilters';
import GuestCheckoutChecklist from './components/GuestCheckoutChecklist';
import NewGuestCheckoutChecklist from './components/NewGuestCheckoutChecklist';

export default function GuestCheckoutChecklistWrapper({
 dic,
}: {
 dic: GuestCheckoutChecklistDictionary;
}) {
 const [selectedCheckListID, setSelectedCheckListID] = useState<number | null>(
  null,
 );
 const [showNew, setShowNew] = useState(false);
 const dateFns = useDateFns();
 const filtersUseForm = useForm<CheckoutChecklistSchema>({
  defaultValues: {
   ...defaultValues,
   fromDate: dateFns.startOfToday(),
   toDate: dateFns.startOfToday(),
  },
  resolver: zodResolver(createCheckoutChecklistSchema()),
 });
 const [fromDateValue, toDateValue, roomValue, maidValue] =
  filtersUseForm.watch(['fromDate', 'toDate', 'room', 'maid']);
 // init data
 const {
  data: initData,
  isLoading: initDataIsLoading,
  isError: initDataIsError,
 } = useQuery({
  queryKey: [guestCheckoutChecklistBaseKey, 'init-data'],
  async queryFn({ signal }) {
   const res = await getInitialData({ signal });
   return res.data;
  },
 });

 // check list
 const {
  data,
  hasNextPage,
  fetchNextPage,
  isFetching,
  refetch,
  isSuccess,
  isError,
 } = useInfiniteQuery({
  enabled: !!fromDateValue && !!toDateValue,
  queryKey: [
   guestCheckoutChecklistBaseKey,
   'list',
   fromDateValue?.toISOString(),
   toDateValue?.toISOString(),
   roomValue?.key || 'all',
   maidValue?.key || 'all',
  ],
  initialPageParam: {
   limit: 50,
   offset: 1,
  },
  async queryFn({ signal, pageParam }) {
   const res = await getCheckoutChecklist({
    signal,
    limit: pageParam.limit.toString(),
    offset: pageParam.offset.toString(),
    fromDate: fromDateValue!.toISOString(),
    toDate: toDateValue!.toISOString(),
    maidID: maidValue?.key,
    roomID: roomValue?.key,
   });
   return res.data;
  },
  getNextPageParam(lastPage) {
   const nextOffset = lastPage.offset + 1;
   if (lastPage.offset * lastPage.limit >= lastPage.rowsCount) {
    return undefined;
   }
   return {
    offset: nextOffset,
    limit: lastPage.limit,
   };
  },
  getPreviousPageParam(firstPage) {
   if (firstPage.offset <= 1) {
    return undefined;
   }
   return {
    limit: firstPage.limit,
    offset: firstPage.offset - 1,
   };
  },
 });

 // edit or new
 function handleOpenEdit(id: number | null) {
  setSelectedCheckListID(id);
  setShowNew(true);
 }
 function handleCloseEdit() {
  setSelectedCheckListID(null);
  setShowNew(false);
 }

 const targetEditChecklist = !!data?.pages[0].rows
  ? data?.pages[0].rows.find((item) => item.id === selectedCheckListID) || null
  : null;

 return (
  <>
   <FormProvider {...filtersUseForm}>
    <></>
    <GuestCheckoutChecklistFilters
     dic={dic}
     initDataIsLoading={initDataIsLoading}
     initData={initData}
     checklist={{
      data,
      hasNextPage,
      fetchNextPage,
      isFetching,
      refetch,
      isSuccess,
      isError,
     }}
     editChecklist={{
      selectedCheckListID,
      showNew,
      onCloseEdit: handleCloseEdit,
      onShowEdit: handleOpenEdit,
      targetEditChecklist,
     }}
    />
    <GuestCheckoutChecklist
     dic={dic}
     checklist={{
      data,
      hasNextPage,
      fetchNextPage,
      isFetching,
      refetch,
      isSuccess,
      isError,
     }}
     editChecklist={{
      selectedCheckListID,
      showNew,
      onCloseEdit: handleCloseEdit,
      onShowEdit: handleOpenEdit,
      targetEditChecklist,
     }}
    />
   </FormProvider>
   <NewGuestCheckoutChecklist
    dic={dic}
    initialData={initData}
    initDataIsLoading={initDataIsLoading}
    editChecklist={{
     selectedCheckListID,
     showNew,
     onCloseEdit: handleCloseEdit,
     onShowEdit: handleOpenEdit,
     targetEditChecklist,
    }}
   />
  </>
 );
}
