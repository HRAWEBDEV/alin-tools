import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import type { Combo } from '../../utils/apiTypes';

const newOrderKey = 'restaurant-new-order';

type ItemGroup = Combo;
interface ItemProgram {
 id: number;
 itemID: number;
 itemCode: number;
 taxRate: number;
 serviceRate: number;
 price: number;
 itemName: string | null;
 isContract?: boolean;
 imageURL?: string | null;
}

type OrderItem = {
 id: number;
 itemID: number;
 itemCode: number;
 itemName: string | null;
 orderID: number;
 price: number;
 amount: number;
 sValue: number;
 discount: number;
 service: number;
 tax: number;
 netValue: number;
 discountRate: number;
 serviceRate: number;
 taxRate: number;
 tagID: number | null;
 tagComment: string | null;
};

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

function getItemPrograms({
 signal,
 itemGroupID,
 contractMenuID,
 orderDateTime,
}: {
 signal: AbortSignal;
 itemGroupID: number;
 contractMenuID: number | null;
 orderDateTime: string;
}) {
 const searchParams = new URLSearchParams([
  ['itemGroupID', itemGroupID.toString()],
  ['orderDateTime', orderDateTime],
 ]);
 if (contractMenuID) {
  searchParams.set('contractMenuID', contractMenuID.toString());
 }
 return axios.get<ItemProgram[]>(
  `/Restaurant/SaleInvoice/GetItemPrograms?${searchParams.toString()}`,
  { signal },
 );
}

// order
function getOrderItems({
 signal,
 orderID,
}: {
 signal: AbortSignal;
 orderID: number;
}) {
 return axios.get<OrderItem[]>(
  `/Restaurant/SaleInvoice/GetOrderItems?orderID=${orderID}`,
  {
   signal,
  },
 );
}

export type { InitialData, ItemGroup, ItemProgram, OrderItem };
export { newOrderKey, getInitData, getItemPrograms, getOrderItems };
