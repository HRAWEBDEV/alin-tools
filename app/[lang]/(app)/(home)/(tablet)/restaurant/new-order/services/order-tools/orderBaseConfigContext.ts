import { use, createContext, ActionDispatch } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';
import {
 type InitialData,
 type ItemGroup,
 type ItemProgram,
 type OrderItem,
 type Order,
 type OrderServiceRates,
} from '../newOrderApiActions';
import { type OrderItemActions } from '../../utils/orderItemsActionsReducer';
import { type ShopCalculatorResult } from '../../utils/shopCalculator';
import { type Combo } from '../../../utils/apiTypes';
import { type OrderInvoicePayment } from '../../schemas/orderInvoicePaymentSchema';

type ConfirmOrderType = (typeof confirmOrderTypes)[number];
const confirmOrderTypes = ['orderInfo', 'shoppingCard', 'invoice'] as const;

interface OrderBaseConfig {
 shopLoading: boolean;
 shopInfoLoading: boolean;
 confirmOrderIsOpen: boolean;
 confirmOrderActiveType: ConfirmOrderType;
 changeConfirmType: (type: ConfirmOrderType) => unknown;
 showConfirmOrder: (type?: ConfirmOrderType) => unknown;
 closeConfirmOrder: () => unknown;
 queries: {
  fromSalons: boolean;
  orderID: number | null;
  salonName: string | null;
 };
 initialDataInfo: {
  data?: InitialData;
  freeTables?: Combo[];
  freeTablesLoading: boolean;
  freeTablesFetching: boolean;
  freeTablesRefetch: () => unknown;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isFetching: boolean;
 };
 itemsInfo: {
  data?: ItemProgram[];
  filteredData: ItemProgram[];
  searchedItemName: string;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isFetching: boolean;
  selectedItemGroup: ItemGroup | null;
  changeSearchedItemName: (newSearch: string) => unknown;
  changeSelectedItemGroup: (newItem: ItemGroup) => unknown;
 };
 userOrder: {
  order: {
   data?: Order;
   isLoading: boolean;
   isError: boolean;
   isSuccess: boolean;
  };
  orderItems: {
   data?: OrderItem[];
   isLoading: boolean;
   isError: boolean;
   isSuccess: boolean;
  };
 };
 order: {
  orderInfoName: string;
  orderItems: OrderItem[];
  serviceRates: {
   data?: OrderServiceRates;
   isLoading: boolean;
   isError: boolean;
  };
  onSaveOrder: () => unknown;
  orderItemsDispatch: ActionDispatch<[action: OrderItemActions]>;
  onCloseOrder: () => unknown;
 };
 invoice: {
  payment: {
   data?: number;
   isLoading: boolean;
   isError: boolean;
  };
  orderTotals: ShopCalculatorResult;
  onPayment: (paymentData: OrderInvoicePayment) => unknown;
  onPaymentPcPos: (paymentData: OrderInvoicePayment) => unknown;
 };
}

const orderBaseConfigContext = createContext<OrderBaseConfig | null>(null);

function useOrderBaseConfigContext() {
 const val = use(orderBaseConfigContext);
 if (!val) throw new OutOfContext('orderToolsContext');
 return val;
}

export type { OrderBaseConfig, ConfirmOrderType };
export { orderBaseConfigContext, confirmOrderTypes, useOrderBaseConfigContext };
