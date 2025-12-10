import { use, createContext, ActionDispatch } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';
import {
 type InitialData,
 type ItemGroup,
 type ItemProgram,
 type OrderItem,
} from '../newOrderApiActions';
import { type OrderItemActions } from '../../utils/orderItemsActionsReducer';

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
 order: {
  orderItems: OrderItem[];
  orderItemsDispatch: ActionDispatch<[action: OrderItemActions]>;
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
