import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import type { Combo } from '../../utils/apiTypes';

const newOrderKey = 'restaurant-new-order';

type ItemGroup = Combo;
interface InitialData {
 orderId: number;
 bonNo: number;
 dailyNo: number;
 orderNo: number;
 orderStateID: number;
 orderCashPrePayment: number;
 defaultSaleTimeID: number;
 defaultSaleTypeID: number;
 itemGroups: ItemGroup[];
 saleTimes: Combo[];
 saleTypes: Combo[];
 salons: Combo[];
 tables: Combo[];
 waiters: Combo[];
 sendToKitchen: boolean;
 printToCashbox: boolean;
}

function getInitData({ signal }: { signal: AbortSignal }) {
 return axios.get<InitialData>('/Restaurant/SaleInvoice/GetInitDatas', {
  signal,
 });
}

export type { InitialData, ItemGroup };
export { newOrderKey, getInitData };
