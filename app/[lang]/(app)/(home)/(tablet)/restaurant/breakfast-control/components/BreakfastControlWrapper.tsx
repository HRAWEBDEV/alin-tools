'use client';
import { type BreakfastControlDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/breakfastControl/dictionary';
import BreakfastControlFilters from './BreakfastControlFilters';
import BreakfastControlList from './BreakfastControlList';
import { useQuery } from '@tanstack/react-query';
import {
 getBreakfastControlDetailsApi,
 getBreakfastControlDetails,
 getBreakfastControlData,
 getBreakfastControlDataApi,
} from '../services/BreakfastControlApiActions';
import { type BreakfastControlProps } from '../utils/BreakfastControlProps';

export default function BreakfastControlWrapper({
 dic,
}: {
 dic: BreakfastControlDictionary;
}) {
 const {
  data: breakfastControlDetails,
  isLoading: isLoadingBreakfastControlDetails,
  isFetching: isFetchingBreakfastControlDetails,
  isError: isErrorBreakfastControlDetails,
  isSuccess: isSuccessBreakfastControlDetails,
 } = useQuery({
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
  queryKey: [getBreakfastControlDataApi],
  enabled: isSuccessBreakfastControlDetails,
  async queryFn({ signal }) {
   const res = await getBreakfastControlData({
    signal,
    checkListId: breakfastControlDetails!.id,
   });
   return res.data;
  },
 });

 const breakfastControlProps: BreakfastControlProps = {
  data: breakfastControlData,
  isLoading: isLoadingBreakfastControlData,
  isFetching: isFetchingBreakfastControlData,
  isError: isErrorBreakfastControlData,
  isSuccess: isSuccessBreakfastControlData,
 };

 return (
  <div>
   <BreakfastControlFilters
    dic={dic}
    breakfastControlProps={breakfastControlProps}
   />
   <BreakfastControlList dic={dic} />
  </div>
 );
}
