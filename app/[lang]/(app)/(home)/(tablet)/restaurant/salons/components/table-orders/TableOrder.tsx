import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { type TableOrder } from '../../services/salonsApiActions';
import { useOrderRedirectLink } from '../../hooks/useOrderRedirectLink';
import { Button } from '@/components/ui/button';
import { MdTouchApp } from 'react-icons/md';
import Link from 'next/link';
import { getTableStateStyles } from '../../utils/tableStates';
import {
 newOrderKey,
 getOrder,
} from '../../../new-order/services/newOrderApiActions';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { DrawerClose } from '@/components/ui/drawer';

export default function TableOrder({
 order,
 orderRedirectLink,
 tableCapacity,
 tableStateType,
}: {
 dic: SalonsDictionary['multiOrder'];
 order: TableOrder;
 tableCapacity: number;
 tableStateType: number;
 orderRedirectLink: ReturnType<typeof useOrderRedirectLink>;
}) {
 const {
  data: userOrder,
  isLoading: userOrderLoading,
  isSuccess: userOrderSuccess,
 } = useQuery({
  staleTime: 'static',
  queryKey: [newOrderKey, 'order-info', order.key],
  async queryFn({ signal }) {
   const { data } = await getOrder({ signal, orderID: Number(order.key) });
   return data;
  },
 });

 const tableStyles = getTableStateStyles(tableStateType);

 return (
  <DrawerClose asChild>
   <Button
    key={order.key}
    variant='outline'
    className={`relative h-auto w-auto flex-col justify-stretch items-stretch size-40 max-h-none ${tableStyles.backgoundColor}`}
    asChild
   >
    <Link
     href={
      orderRedirectLink && userOrderSuccess
       ? `${orderRedirectLink}&orderID=${order.key}`
       : '#'
     }
    >
     {!userOrderLoading && userOrderSuccess ? (
      <>
       <div className='absolute bottom-0 end-0 z-0'>
        <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
       </div>
       <div className='flex flex-col z-1 grow'>
        <div className='text-start grow'>
         <div className='flex items-center gap-2 mb-3'>
          <h3
           className={`text-2xl lg:text-3xl ${tableStyles.text} font-en-roboto group-data-[bold=true]:font-black`}
          >
           {userOrder.orderNo}
          </h3>
         </div>
         <div>
          <p className='text-sm text-primary text-wrap group-data-[bold=true]:font-medium'>
           {userOrder.saleTypeName}
          </p>
          <p className='text-md text-neutral-500 dark:text-neutral-400 text-wrap group-data-[bold=true]:font-medium'>
           {userOrder.customerName}
          </p>
         </div>
        </div>
        <div className='flex items-center justify-between gap-4'>
         <div className='flex items-center gap-1 text-base text-neutral-600 dark:text-neutral-400 font-medium group-data-[bold=true]:font-bold'>
          <span>--</span>
         </div>
         <div
          style={{
           direction: 'ltr',
          }}
          className={`font-medium text-base ${tableStyles.text} group-data-[bold=true]:font-bold`}
         >
          {userOrder.persons || '-'}
          {tableCapacity ? `/ ${tableCapacity}` : ''}
         </div>
        </div>
       </div>
      </>
     ) : (
      <div className='grow grid place-content-center'>
       <Spinner className='size-10 text-primary' />
      </div>
     )}
    </Link>
   </Button>
  </DrawerClose>
 );
}
