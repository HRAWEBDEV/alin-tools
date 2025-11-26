import { use, createContext } from 'react';
import { OutOfContext } from '@/utils/OutOfContext';

type ConfirmOrderType = 'shopping-card' | 'order-info';

interface OrderTools {
 confirmOrderIsOpen: boolean;
 confirmOrderActiveType: ConfirmOrderType;
 showConfirmOrder: (type?: ConfirmOrderType) => unknown;
 closeConfirmOrder: () => unknown;
}

const orderToolsContext = createContext<OrderTools | null>(null);

function useOrderToolsContext() {
 const val = use(orderToolsContext);
 if (!val) throw new OutOfContext('orderToolsContext');
 return val;
}

export type { OrderTools, ConfirmOrderType };
export { orderToolsContext, useOrderToolsContext };
