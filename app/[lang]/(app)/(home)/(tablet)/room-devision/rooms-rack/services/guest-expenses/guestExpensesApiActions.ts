import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { type Combo } from '../../../../restaurant/utils/apiTypes';

interface InitialData {
 items: Combo[];
 programs: Combo[];
 minibarPrograms: Combo[];
 arzs: Combo[];
}

interface Revenue {
 id: number;
 registerID: number;
 roomID: number | null;
 dateTimeDateTimeOffset: string;
 itemID: number;
 amount: number;
 sValue: number;
 discount: number;
 discountRate: number;
 service: number;
 serviceRate: number;
 tax: number;
 taxRate: number;
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
}

function getInitialData({
 registerID,
 signal,
}: {
 registerID: number;
 signal: AbortSignal;
}) {
 const searchParams = new URLSearchParams([
  ['RegisterID', registerID.toString()],
 ]);
 return axios.get<InitialData>(
  `/Reception/RoomGuestCost/GetInitDatas?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

function getRevenues({
 signal,
 registerID,
 date,
 itemID,
 deleted,
}: {
 signal: AbortSignal;
 registerID: number;
 date?: string;
 itemID?: string;
 deleted: string;
}) {
 const searchParams = new URLSearchParams([
  ['registerID', registerID.toString()],
  ['deleted', deleted],
 ]);
 if (date) {
  searchParams.set('date', date);
 }
 if (itemID) {
  searchParams.set('itemID', itemID);
 }
 return axios.get<Revenue[]>(
  `/Reception/RoomGuestCost/GetItemRevenues?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

export type { InitialData, Revenue };
export { getInitialData, getRevenues };
