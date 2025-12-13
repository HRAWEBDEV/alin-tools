import { use, createContext, ActionDispatch } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';
import {
 type InitialData,
 type ItemGroup,
 type ItemProgram,
 type OrderItem,
 type Order,
} from '../newOrderApiActions';
import { type OrderItemActions } from '../../utils/orderItemsActionsReducer';
import { type ShopCalculatorResult } from '../../utils/shopCalculator';

type ConfirmOrderType = (typeof confirmOrderTypes)[number];
const confirmOrderTypes = ['orderInfo', 'shoppingCard', 'invoice'] as const;

interface OrderBaseConfig {
 confirmOrderIsOpen: boolean;
 confirmOrderActiveType: ConfirmOrderType;
 changeConfirmType: (type: ConfirmOrderType) => unknown;
 showConfirmOrder: (type?: ConfirmOrderType) => unknown;
 closeConfirmOrder: () => unknown;
 queries: {
  fromSalons: boolean;
  orderID: number | null;
 };
 initialDataInfo: {
  data?: InitialData;
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
  orderItems: OrderItem[];
  orderItemsDispatch: ActionDispatch<[action: OrderItemActions]>;
 };
 invoice: {
  orderTotals: ShopCalculatorResult;
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
