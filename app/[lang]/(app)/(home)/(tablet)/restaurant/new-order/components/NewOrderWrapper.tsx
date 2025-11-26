import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import OrderTools from './OrderTools';
import NewOrderHeader from './NewOrderHeader';
import OrderCategories from './OrderCategories';
import OrderItems from './OrderItems';

export default function NewOrderWrapper({ dic }: { dic: NewOrderDictionary }) {
 return (
  <div>
   <div className='mb-4 p-4 lg:p-8'>
    <NewOrderHeader dic={dic} />
    <OrderTools dic={dic} />
    <OrderCategories dic={dic} />
   </div>
   <OrderItems dic={dic} />
  </div>
 );
}
