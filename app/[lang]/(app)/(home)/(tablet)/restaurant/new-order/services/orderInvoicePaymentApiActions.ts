import { type Combo } from '../../utils/apiTypes';
import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';

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

const newOrderPaymentKey = 'restaurant-new-order-payment';

function getOrderInvoicePaymentInitData({ signal }: { signal: AbortSignal }) {
 return axios.get<OrderInvoicePaymentInitData>(
  '/Restaurant/CloseOrder/GetInitDatas',
  {
   signal,
  },
 );
}

export type { PcPos, OrderInvoicePaymentInitData };
export { newOrderPaymentKey, getOrderInvoicePaymentInitData };
