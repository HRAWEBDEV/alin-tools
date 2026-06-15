'use client';
import { type BreakfastControlDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/breakfastControl/dictionary';
import BreakfastControlFilters from './BreakfastControlFilters';
import BreakfastControlList from './BreakfastControlList';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
 getBreakfastControlDetailsApi,
 getBreakfastControlDetails,
 getBreakfastControlData,
 getBreakfastControlDataApi,
} from '../services/BreakfastControlApiActions';
import { type BreakfastControlProps } from '../utils/BreakfastControlProps';
import { useForm, FormProvider } from 'react-hook-form';
import {
 type BreakfastControlFiltersSchema,
 createBreakfastControlFiltersSchema,
 defaultValues,
} from '../schemas/breakfastControlFiltersSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedValue } from '@tanstack/react-pacer';

export default function BreakfastControlWrapper({
 dic,
}: {
 dic: BreakfastControlDictionary;
}) {
 const filtersUseForm = useForm<BreakfastControlFiltersSchema>({
  defaultValues,
  resolver: zodResolver(createBreakfastControlFiltersSchema()),
 });
 const [searchValue] = filtersUseForm.watch(['search']);
 const [debouncedSearchValue] = useDebouncedValue(searchValue, {
  wait: 500,
 });
 const queryClient = useQueryClient();
 const {
  data: breakfastControlDetails,
  isLoading: isLoadingBreakfastControlDetails,
  isFetching: isFetchingBreakfastControlDetails,
  isError: isErrorBreakfastControlDetails,
  isSuccess: isSuccessBreakfastControlDetails,
 } = useQuery({
  gcTime: 0,
  staleTime: 'static',
  queryKey: [getBreakfastControlDetailsApi],
  async queryFn({ signal }) {
   const res = await getBreakfastControlDetails({ signal });
   return res.data;
  },
 });

 const {
  data: breakfastControlData,
  isLoading: isLoadingBreakfastControlData,
  isFetching: isFetchingBreakfastControlData,
  isError: isErrorBreakfastControlData,
  isSuccess: isSuccessBreakfastControlData,
 } = useQuery({
  queryKey: [
   getBreakfastControlDataApi,
   breakfastControlDetails?.id || 'all',
   debouncedSearchValue || 'all',
  ],
  enabled: isSuccessBreakfastControlDetails,
  async queryFn({ signal }) {
   const res = await getBreakfastControlData({
    signal,
    checkListId: breakfastControlDetails!.id,
    searchText: debouncedSearchValue,
   });
   return res.data;
  },
 });

 function handleInvalidateQueries() {
  queryClient.invalidateQueries({
   queryKey: [getBreakfastControlDataApi, breakfastControlDetails?.id || 'all'],
  });
 }

 const breakfastControlProps: BreakfastControlProps = {
  data: breakfastControlData,
  onInvalidateQueries: handleInvalidateQueries,
  isLoading: isLoadingBreakfastControlData || isLoadingBreakfastControlDetails,
  isFetching:
   isFetchingBreakfastControlData || isFetchingBreakfastControlDetails,
  isError: isErrorBreakfastControlData || isErrorBreakfastControlDetails,
  isSuccess: isSuccessBreakfastControlData && isSuccessBreakfastControlDetails,
 };

 return (
  <div>
   <FormProvider {...filtersUseForm}>
    <BreakfastControlFilters
     dic={dic}
     breakfastControlProps={breakfastControlProps}
     date={breakfastControlDetails?.dateTimeDateTimeOffset}
    />
    <BreakfastControlList
     dic={dic}
     breakfastControlProps={breakfastControlProps}
    />
   </FormProvider>
  </div>
 );
}
