import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';

interface Hall {
 key: string;
 value: string;
}
type Table = {
 vip: boolean;
 tableID: number;
 tableNo: number;
 expired: boolean;
 tableStateDataID: number;
 tableStateID: number;
 tableStateTypeID: number;
 tableCapacity: number;
 startTime: string | null;
 salonID: number;
 saleTimeID: number;
 orderID: number;
 orderNo: number | null;
 endTime: string | null;
 date: string;
 maxCapicity: number;
 salonName: string | null;
 tableTypeID: number;
 contractName?: string;
 customerName?: string;
 guestName?: string;
 saleTypeName?: string;
 roomLable?: number;
 customerID: number | null;
 saleTypeID: number | null;
 remained: number | null;
};

const getHallKey = 'restaurant-halls';

function getHalls({ signal }: { signal: AbortSignal }) {
 return axios.get<{ halls: Hall[] }>('/Restaurant/Tablet/GetHalls', {
  signal,
 });
}

export { type Hall, type Table };
export { getHallKey, getHalls };
