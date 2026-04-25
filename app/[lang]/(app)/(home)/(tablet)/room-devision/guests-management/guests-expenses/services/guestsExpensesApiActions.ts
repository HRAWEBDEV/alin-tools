import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import {
 type Combo,
 PagedData,
} from '@/app/[lang]/(app)/(home)/(tablet)/restaurant/utils/apiTypes';

type ReadMode = 'read' | 'edit' | 'new';

type Room = {
 id: number;
 roomLabel: string;
 roomTypeName: string;
};

type Item = {
 itemID: number;
 itemName: string | null;
 price: number;
 serviceRate: number | null;
 taxRate: number | null;
};

type PricesRate = {
 serviceRate: number | null;
 taxRate: number | null;
 price: number;
};

type GetRevenuesProps = {
 limit: number;
 offset: number;
 date?: string;
 itemID?: number;
 roomID?: number;
};

type Revenue = {
 id: number;
 registerID: number;
 roomID: number;
 dateTimeDateTimeOffset: string;
 itemID: number;
 amount: number;
 sValue: number;
 discount: number;
 service: number;
 tax: number;
 arzID: number;
 totalValue: number | null;
 entityID: number | null;
 entityValue: number;
 roomLabel: string | null;
 roomNo: number | null;
 orderID: number | null;
 orderNo: number | null;
 bonNo: number | null;
 arzName: string | null;
 programName: string | null;
 progrmID: number;
 itemName: string | null;
 comment: string | null;
 refProgramName: string | null;
 refProgramID: number | null;
};

type RegisterRevenue = {
 registerID: number;
 roomID: number;
 revenues: Revenue[];
};

type RegisterRoomNight = {
 id: number;
 registerID: number;
};

type Register = {
 id: number;
 registerStateID: number;
 folioID: number | null;
 roomID: number;
 roomTypeID: number;
 arrivalDateTimeOffset: string;
 checkinDateTimeOffset: string;
 depatureDateTimeOffset: string;
};

type RegisterInfo = {
 register: Register;
 arzs: Combo;
};

const getRoomsApi = '/HouseKeeping/ChargingTheCost/GetRooms';
const getRevenuesApi = '/HouseKeeping/ChargingTheCost/GetRevenues';
const getItemsApi = '/HouseKeeping/ChargingTheCost/GetItems';
const getRegisterRoomNightApi =
 '/HouseKeeping/ChargingTheCost/GetRegisterRoomNight';
const getRegisterInfoApi = '/HouseKeeping/ChargingTheCost/GetRegisterInfo';
const saveRegisterRevenueApi =
 '/HouseKeeping/ChargingTheCost/SaveRegisterRevenue';
const updateRegisterRevenueApi =
 '/HouseKeeping/ChargingTheCost/UpdateRegisterRevenue';
const revertRevenueApi = '/HouseKeeping/ChargingTheCost/RevertRevenue';
const deleteRevenueApi = '/HouseKeeping/ChargingTheCost/RemoveRevenue';

const getRevenues = ({
 signal,
 limit,
 offset,
 date,
 itemID,
 roomID,
}: { signal: AbortSignal } & GetRevenuesProps) => {
 const searchParams = new URLSearchParams([
  ['limit', limit.toString()],
  ['offset', offset.toString()],
 ]);
 if (date) {
  searchParams.set('date', date);
 }
 if (itemID) {
  searchParams.set('itemID', itemID.toString());
 }
 if (roomID) {
  searchParams.set('roomID', roomID.toString());
 }

 return axios.get<PagedData<Revenue[]>>(
  `${getRevenuesApi}?${searchParams.toString()}`,
  { signal },
 );
};

const getItems = ({
 limit,
 offset,
 signal,
}: {
 limit: number;
 offset: number;
 signal: AbortSignal;
}) => {
 const searchParams = new URLSearchParams([
  ['Limit', limit.toString()],
  ['Offset', offset.toString()],
 ]);
 return axios.get<PagedData<Item[]>>(
  `${getItemsApi}?${searchParams.toString()}`,
  {
   signal: signal,
  },
 );
};

const getRooms = ({
 limit,
 offset,
 signal,
}: {
 limit: number;
 offset: number;
 signal: AbortSignal;
}) => {
 const searchParams = new URLSearchParams([
  ['Limit', limit.toString()],
  ['Offset', offset.toString()],
 ]);
 return axios.get<PagedData<Room[]>>(
  `${getRoomsApi}?${searchParams.toString()}`,
  {
   signal,
  },
 );
};

const getRegisterRoomNight = ({
 signal,
 roomID,
}: {
 signal: AbortSignal;
 roomID: number;
}) => {
 return axios.get<RegisterRoomNight>(
  `${getRegisterRoomNightApi}?RoomID=${roomID}`,
  { signal },
 );
};

const getRegisterInfo = ({
 signal,
 registerID,
}: {
 signal: AbortSignal;
 registerID: number;
}) => {
 return axios.get<RegisterInfo>(
  `${getRegisterInfoApi}?RegisterID=${registerID}`,
  {
   signal,
  },
 );
};

const saveRegisterRevenue = (newRevenue: RegisterRevenue) => {
 return axios.post<RegisterRevenue>(saveRegisterRevenueApi, newRevenue);
};

const updateRegisterRevenue = (newRevenue: RegisterRevenue) => {
 return axios.put<RegisterRevenue>(updateRegisterRevenueApi, newRevenue);
};

const revertRevenue = (revenueId: number) => {
 return axios.post(`${revertRevenueApi}?RevenueID=${revenueId}`);
};

const deleteRevenue = (revenueId: number) => {
 return axios.delete(`${deleteRevenueApi}?RevenueID=${revenueId}`);
};

export {
 type Room,
 type ReadMode,
 type PricesRate,
 type Item,
 type Revenue,
 type Register,
 type RegisterInfo,
 type RegisterRoomNight,
 type GetRevenuesProps,
 getItems,
 getRooms,
 getRevenues,
 getRevenuesApi,
 getRegisterInfo,
 getRegisterInfoApi,
 getRegisterRoomNight,
 getRegisterRoomNightApi,
 saveRegisterRevenue,
 updateRegisterRevenue,
 revertRevenue,
 deleteRevenue,
};
