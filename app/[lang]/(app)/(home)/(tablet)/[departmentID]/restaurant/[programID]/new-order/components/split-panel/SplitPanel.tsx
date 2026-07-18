'use client';
import { useState } from 'react';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import ShopOrderItem from './ShopOrderItem';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';

export default function SplitPanel({ dic }: { dic: NewOrderDictionary }) {
 const {
  shopInfoLoading,
  access,
  showSplitPanel,
  showConfirmOrder,
  order: { orderItems, onSaveOrder },
 } = useOrderBaseConfigContext();
 const [selectedOrderItemId, setSelectedOrderItemId] = useState<number | null>(
  null,
 );
 return (
  <div
   data-show-split-panel={showSplitPanel}
   className='bg-neutral-100 dark:bg-neutral-900 border-s border-border w-(--app-restaurant-nav-width) fixed end-0 top-(--app-restaurant-header-height) lg:top-0 bottom-(--app-restaurant-tabs-height) in-data-[scroll-dicretion="down"]:bottom-0 lg:bottom-0 sm:flex flex-col overflow-auto hidden'
  >
   <div className='sticky top-0 bg-neutral-100 dark:bg-neutral-900 z-3 p-4 border-b border-border'>
    <div className='flex gap-1 items-center'>
     <h3 className='font-medium text-lg'>{dic.tools.shoppingCard}</h3>
     {!!orderItems.length && (
      <Badge className='size-7 text-md'>{orderItems.length}</Badge>
     )}
    </div>
   </div>
   <div className='grow'>
    {!!orderItems.length ? (
     <ul>
      {orderItems.map((item) => (
       <ShopOrderItem
        key={item.id}
        dic={dic}
        orderItem={item}
        searchedOrder=''
        selectedOrderItemId={selectedOrderItemId}
        setSelectedOrderItemId={setSelectedOrderItemId}
       />
      ))}
     </ul>
    ) : (
     <NoItemFound />
    )}
   </div>
   <div className='sticky bottom-0 bg-neutral-100 dark:bg-neutral-900 z-3 grid gap-2 grid-cols-2 p-2 border-t border-border'>
    <Button
     variant='secondary'
     className='h-11 max-sm:p-3 max-sm:grow'
     disabled={
      shopInfoLoading || !access['order']['edit'] || !orderItems.length
     }
     onClick={() => {
      onSaveOrder();
     }}
    >
     {shopInfoLoading && <Spinner />}
     {dic.invoice.confirmOrder}
    </Button>
    <Button
     className='h-11 max-sm:p-3 max-sm:grow'
     disabled={!orderItems.length || shopInfoLoading}
     onClick={() => showConfirmOrder('invoice')}
    >
     {shopInfoLoading && <Spinner />}
     {dic.orderConfirm.invoice}
    </Button>
   </div>
  </div>
 );
}
