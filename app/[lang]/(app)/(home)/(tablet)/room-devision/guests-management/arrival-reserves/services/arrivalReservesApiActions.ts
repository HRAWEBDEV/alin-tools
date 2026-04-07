import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import {
 type GetSearchQueryValuesResult,
 SetSearchQueryOnPathname,
} from '../../utils/searchQueryValues';

type Customer = {
 id: number;
 name: string;
};
type SelectOption = { key: string; value: string };
type SelectOptions = SelectOption[];
type ApiPagedData<T> = {
 rowsCount: number;
 limit: number;
 offset: number;
 rows: T;
};
type ReserveRoom = {
 id: number;
 name: string;
 reserveID: number;
 reserveNo: number;
 roomTypeID: number;
 roomTypeName: string;
 customerName: string;
 checkinDateTimeOffset: string;
 arrivalDateTimeOffset: string;
 depatureDateTimeOffset: string;
 nights: number;
 adultCount: number;
 babyCount: number;
 childCount: number;
 arzName: string;
};

const getCustomerApi = '/Reception/ArrivalReserves/GetCustomers';
const getInitDatasApi = '/Reception/ArrivalReserves/GetDatas';
const getReserveRoomsApi = '/Reception/ArrivalReserves/GetReserveRooms';
const getInitDatasQueryKey = 'share-arrival-reserves-init-datas';
const initDataDefaults: SelectOptions = [];
const getInitDatas = (signal: AbortSignal) => {
 return axios.get<SelectOptions>(getInitDatasApi, { signal });
};

let customerAbortController: AbortController | null = null;
const getCustomers = (
 signal: AbortSignal,
 queryValues?: GetSearchQueryValuesResult,
) => {
 customerAbortController?.abort();
 customerAbortController = new AbortController();
 const queryPathname = SetSearchQueryOnPathname({
  pathname: getCustomerApi,
  queryValues: queryValues || {},
 });
 return axios.get<ApiPagedData<Customer[]>>(queryPathname, {
  signal,
 });
};

const getReserveRoomsQueryKey = 'share-arrival-reserves-get-datas';
const reserveRoomsDefault: ReserveRoom[] = [];
const getReserveRooms = (
 signal: AbortSignal,
 queryValues: GetSearchQueryValuesResult,
) => {
 const queryPathname = SetSearchQueryOnPathname({
  pathname: getReserveRoomsApi,
  queryValues,
 });
 return axios.get<ApiPagedData<ReserveRoom[]>>(queryPathname, {
  signal,
 });
};

export {
 type Customer,
 type ReserveRoom,
 type ApiPagedData,
 type SelectOption,
 type SelectOptions,
 initDataDefaults,
 getInitDatasQueryKey,
 reserveRoomsDefault,
 getReserveRoomsQueryKey,
 getCustomers,
 getInitDatas,
 getReserveRooms,
};
