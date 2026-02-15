'use client';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import OrderTools from './OrderTools';
import NewOrderHeader from './NewOrderHeader';
import OrderCategories from './OrderCategories';
import OrderItems from './OrderItems';
import OrderBaseConfigProvider from '../services/order-tools/OrderBaseConfigProvider';
import ConfirmOrderModal from './confirm-order/ConfrimOrderModal';
import InitialConfirmOrderTrigger from './confirm-order/InitialConfirmOrderTrigger';

export default function NewOrderWrapper({ dic }: { dic: NewOrderDictionary }) {
 return (
  <OrderBaseConfigProvider dic={dic}>
   <div>
    <div className='p-4 lg:p-8 pb-0!'>
     <NewOrderHeader dic={dic} />
    </div>
    <div className='p-4 lg:px-8 top-0 sticky bg-background'>
     <OrderTools dic={dic} />
     <OrderCategories dic={dic} />
    </div>
    <OrderItems dic={dic} />
    <InitialConfirmOrderTrigger />
    <ConfirmOrderModal dic={dic} />
   </div>
  </OrderBaseConfigProvider>
 );
}
