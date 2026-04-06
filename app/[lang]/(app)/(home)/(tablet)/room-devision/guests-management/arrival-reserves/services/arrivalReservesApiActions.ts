import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import {
 type GetSearchQueryValuesResult,
 SetSearchQueryOnPathname,
} from '../../utils/searchQueryValues';

type TCustomer = {
 id: number;
 name: string;
};
type SelectOption = { key: string; value: string };
type TSelectOptons = SelectOption[];
type TApiPagedData<T> = {
 rowsCount: number;
 limit: number;
 offset: number;
 rows: T;
};
type TReserveRoom = {
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

type TAvailableDate = {
 dateDateTimeOffset: string;
 roomID: number;
 roomTypeID: number;
 roomLabel: string;
};

type TReserveRoomNight = {
 id: number;
 dateDateTimeOffset: string;
 checkinDateTimeOffset: string;
 arrivalDateTimeOffset: string;
 depatureDateTimeOffset: string;
 roomTypeID: number | null;
 roomID: number | null;
 roomLabel: string | null;
 roomPrice: number;
};

const getCustomerApi = '/Reception/ArrivalReserves/GetCustomers';
const getInitDatasApi = '/Reception/ArrivalReserves/GetDatas';
const getReserveRoomsApi = '/Reception/ArrivalReserves/GetReserveRooms';
const getReserveRoomNightsApi =
 '/Reception/ArrivalReserves/GetReserveRoomNights';
const onRoomValueChangeApi = '/Reception/ArrivalReserves/RoomNoValueChange';
const getAvailableRoomsApi = '/Reception/ArrivalReserves/GetAvailableRooms';
const saveRoomAllocationApi = '/Reception/ArrivalReserves/SaveRoomAllocation';
const saveReserveChargeApi = '/Reception/ArrivalReserves/SaveReserveCharge';
const saveNoShowReserveRoomNightApi =
 '/Reception/ArrivalReserves/SaveNoShowReserveRoomNight';
const updateReserveRoomNightPriceApi =
 '/Reception/ArrivalReserves/UpdateReserveRoomNightPrice';

const getInitDatasQueryKey = 'share-arrival-reserves-init-datas';
const initDataDefaults: TSelectOptons = [];
const getInitDatas = (signal: AbortSignal) => {
 return axios.get<TSelectOptons>(getInitDatasApi, { signal });
};

let customerAbortController: AbortController | null = null;
const getCustomers = (queryValues: GetSearchQueryValuesResult) => {
 customerAbortController?.abort();
 customerAbortController = new AbortController();
 const queryPathname = SetSearchQueryOnPathname({
  pathname: getCustomerApi,
  queryValues,
 });
 return axios.get<TApiPagedData<TCustomer[]>>(queryPathname, {
  signal: customerAbortController.signal,
 });
};

const getReserveRoomsQueryKey = 'share-arrival-reserves-get-datas';
const reserveRoomsDefault: TReserveRoom[] = [];
const getReserveRooms = (
 signal: AbortSignal,
 queryValues: GetSearchQueryValuesResult,
) => {
 const queryPathname = SetSearchQueryOnPathname({
  pathname: getReserveRoomsApi,
  queryValues,
 });
 return axios.get<TApiPagedData<TReserveRoom[]>>(queryPathname, {
  signal,
 });
};

const getReserveRoomNights = ({
 reserveRoomID,
 checkinDate,
}: {
 checkinDate: string;
 reserveRoomID: number;
}) => {
 return axios.get<TReserveRoomNight[]>(
  `${getReserveRoomNightsApi}?ReserveRoomID=${reserveRoomID}&CheckinDate=${checkinDate}`,
 );
};

const onRoomValueChange = ({
 checkinDate,
 departureDate,
 roomID,
}: {
 checkinDate: string;
 departureDate: string;
 roomID: number;
}) => {
 return axios.get<string[]>(
  `${onRoomValueChangeApi}?CheckinDate=${checkinDate}&DepartureDate=${departureDate}&RoomID=${roomID}`,
 );
};

let getAvailableAbortController: AbortController | null = null;
const getAvailableRooms = ({
 checkinDate,
 departureDate,
 roomTypeID,
}: {
 checkinDate: string;
 departureDate: string;
 roomTypeID: number;
}) => {
 getAvailableAbortController?.abort();
 getAvailableAbortController = new AbortController();
 return axios.get<TSelectOptons>(
  `${getAvailableRoomsApi}?CheckinDate=${checkinDate}&DepartureDate=${departureDate}&RoomTypeID=${roomTypeID}`,
  { signal: getAvailableAbortController.signal },
 );
};

const saveRoomAllocation = (newRoomAllocation: TReserveRoomNight[]) => {
 return axios.put(saveRoomAllocationApi, newRoomAllocation);
};

const saveReserveCharge = (reserveRoomId: number) => {
 return axios.put(`${saveReserveChargeApi}?ReserveRoomID=${reserveRoomId}`);
};

const saveNoShowReserveRoomNight = (reserveRoomNightId: number) => {
 return axios.put(
  `${saveNoShowReserveRoomNightApi}?ReserveRoomNightID=${reserveRoomNightId}`,
 );
};

const updateReserveRoomNightPrice = ({
 reserveRoomNightId,
 price,
}: {
 reserveRoomNightId: number;
 price: number;
}) => {
 return axios.put(
  `${updateReserveRoomNightPriceApi}?ReserveRoomNightID=${reserveRoomNightId}&Price=${price}`,
 );
};

export {
 type TCustomer,
 type TReserveRoom,
 type TReserveRoomNight,
 type TAvailableDate,
 initDataDefaults,
 getInitDatasQueryKey,
 reserveRoomsDefault,
 getReserveRoomsQueryKey,
 getCustomers,
 getInitDatas,
 getReserveRooms,
 getReserveRoomNights,
 onRoomValueChange,
 getAvailableRooms,
 saveRoomAllocation,
 saveReserveCharge,
 saveNoShowReserveRoomNight,
 updateReserveRoomNightPrice,
};
