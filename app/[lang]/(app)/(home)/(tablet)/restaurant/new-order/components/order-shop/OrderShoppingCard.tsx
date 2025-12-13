import { useState } from 'react';
import { NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import OrderShoppingList from './OrderShoppingList';
import {
 InputGroup,
 InputGroupInput,
 InputGroupAddon,
} from '@/components/ui/input-group';
import { IoSearch } from 'react-icons/io5';

export default function OrderShoppingCard({
 dic,
}: {
 dic: NewOrderDictionary;
}) {
 const [searchedOrder, setSearchedOrder] = useState('');
 return (
  <div>
   <div className='grid my-2'>
    <InputGroup className='bg-neutral-100 dark:bg-neutral-900 h-11'>
     <InputGroupAddon align='inline-start'>
      <IoSearch className='text-primary size-5' />
     </InputGroupAddon>
     <InputGroupInput
      type='search'
      placeholder={dic.tools.search + ' ...'}
      value={searchedOrder}
      onChange={(e) => setSearchedOrder(e.target.value)}
      className='placeholder:text-base'
     />
    </InputGroup>
   </div>
   <OrderShoppingList dic={dic} searchedOrder={searchedOrder} />
  </div>
 );
}
