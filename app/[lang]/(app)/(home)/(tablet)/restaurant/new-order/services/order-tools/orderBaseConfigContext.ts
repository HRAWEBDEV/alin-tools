import { use, createContext } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';
import { type InitialData, type ItemGroup } from '../newOrderApiActions';

type ConfirmOrderType = (typeof confirmOrderTypes)[number];
const confirmOrderTypes = ['orderInfo', 'shoppingCard'] as const;

interface OrderBaseConfig {
 confirmOrderIsOpen: boolean;
 confirmOrderActiveType: ConfirmOrderType;
 changeConfirmType: (type: ConfirmOrderType) => unknown;
 showConfirmOrder: (type?: ConfirmOrderType) => unknown;
 closeConfirmOrder: () => unknown;
 initialDataInfo: {
  data: InitialData;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isFetching: boolean;
 };
 itemsInfo: {
  selectedItemGroup: ItemGroup | null;
  changeSelectedItemGroup: (newItem: ItemGroup) => unknown;
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
