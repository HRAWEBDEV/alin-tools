import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import NewOrderHeader from './NewOrderHeader';

export default function NewOrderWrapper({ dic }: { dic: NewOrderDictionary }) {
 return (
  <div>
   <NewOrderHeader dic={dic} />
  </div>
 );
}
