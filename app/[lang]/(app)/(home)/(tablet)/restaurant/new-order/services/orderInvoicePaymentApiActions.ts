import { type Combo } from '../../utils/apiTypes';
import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { type SaveOrderPackage } from './newOrderApiActions';

type PcPos = {
 posTablet: boolean;
} & Combo;

interface OrderInvoicePaymentInitData {
 banks: Combo[];
 payTypes: Combo[];
 defaultPayTypeID: number;
 defaultBankID: number;
 defaultPosID: number;
}

interface SaveCashPackage {
 payTypeID: number | null;
 bankAccountID: number | null;
 payRefNo: string | null;
 sValue: number;
}

const noCashDefault: SaveCashPackage = {
 bankAccountID: null,
 payRefNo: null,
 payTypeID: null,
 sValue: 0,
};

const newOrderPaymentKey = 'restaurant-new-order-payment';

function getOrderInvoicePaymentInitData({ signal }: { signal: AbortSignal }) {
 return axios.get<OrderInvoicePaymentInitData>(
  '/Restaurant/CloseOrder/GetInitDatas',
  {
   signal,
  },
 );
}

function saveAndCloseOrder({
 order,
 orderItems,
 cash = noCashDefault,
 sendToKitchen = false,
 printToCashBox = false,
}: {
 sendToKitchen?: boolean;
 printToCashBox?: boolean;
 cash?: SaveCashPackage;
} & SaveOrderPackage) {
 return axios.post<{ message: string }>(
  `/Restaurant/CloseOrder/SaveOrderAndClose?sendToKitchen=${sendToKitchen}&printToCashBox=${printToCashBox}`,
  {
   order,
   orderItems,
   cash,
  },
 );
}

export type { PcPos, OrderInvoicePaymentInitData, SaveCashPackage };
export {
 newOrderPaymentKey,
 getOrderInvoicePaymentInitData,
 saveAndCloseOrder,
};
