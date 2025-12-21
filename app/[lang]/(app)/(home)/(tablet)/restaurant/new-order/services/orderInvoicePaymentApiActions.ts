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

function sendToPcPos({
 bankID,
 posID,
 order,
 orderItems,
 sendToKitchen,
 printToCashBox,
}: {
 bankID: number;
 posID: number;
 sendToKitchen: boolean;
 printToCashBox: boolean;
} & SaveOrderPackage) {
 return axios.post<{ refNumber: string; remained: number; message: string }>(
  `/Restaurant/CloseOrder/SendToPosWithSave?BankID=${bankID}&PosID=${posID}&sendToKitchen=${sendToKitchen}&printToCashBox=${printToCashBox}`,
  {
   order,
   orderItems,
   cash: null,
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
 sendToPcPos,
};
