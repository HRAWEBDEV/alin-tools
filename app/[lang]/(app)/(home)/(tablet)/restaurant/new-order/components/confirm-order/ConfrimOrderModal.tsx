'use client';
import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogHeader,
 DialogFooter,
 DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import {
 type ConfirmOrderType,
 useOrderToolsContext,
} from '../../services/order-tools/orderToolsContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrderShoppingCard from '../order-shop/OrderShoppingCard';
import OrderInfo from '../order-info/OrderInfo';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { Badge } from '@/components/ui/badge';
import { DialogClose } from '@radix-ui/react-dialog';

export default function ConfirmOrderModal({
 dic,
}: {
 dic: NewOrderDictionary;
}) {
 const { localeInfo } = useBaseConfig();
 const {
  confirmOrderIsOpen,
  confirmOrderActiveType,
  changeConfirmType,
  showConfirmOrder,
  closeConfirmOrder,
 } = useOrderToolsContext();
 return (
  <Dialog
   open={confirmOrderIsOpen}
   onOpenChange={(open) => {
    if (open) {
     showConfirmOrder();
     return;
    }
    closeConfirmOrder();
   }}
  >
   <DialogContent className='w-[min(100%,45rem)] max-w-none! p-0'>
    <DialogHeader className='p-4'>
     <DialogTitle className='hidden'></DialogTitle>
     <DialogDescription className='hidden'></DialogDescription>
    </DialogHeader>
    <div className='min-h-[40svh] max-h-[80svh] overflow-auto p-4 pt-0'>
     <Tabs
      dir={localeInfo.contentDirection}
      value={confirmOrderActiveType}
      onValueChange={(newValue) =>
       changeConfirmType(newValue as ConfirmOrderType)
      }
     >
      <TabsList className='self-center sticky top-0'>
       <TabsTrigger value='orderInfo' className='w-40'>
        {dic.tools.orderInfo}
       </TabsTrigger>
       <TabsTrigger value='shoppingCard' className='w-40'>
        {dic.tools.shoppingCard}
        <Badge className='p-1 size-6 rounded-full'>20</Badge>
       </TabsTrigger>
      </TabsList>
      <TabsContent value='orderInfo'>
       <OrderInfo dic={dic} />
      </TabsContent>
      <TabsContent value='shoppingCard'>
       <OrderShoppingCard dic={dic} />
      </TabsContent>
     </Tabs>
    </div>
    <DialogFooter className='p-4'>
     <DialogClose asChild>
      <Button variant='destructive' className='sm:w-24'>
       {dic.orderConfirm.cancel}
      </Button>
     </DialogClose>
     {confirmOrderActiveType === 'orderInfo' && (
      <Button className='sm:w-24'>{dic.orderInfo.confirm}</Button>
     )}
     {confirmOrderActiveType === 'shoppingCard' && (
      <Button className='sm:w-24'>{dic.orderConfirm.confirm}</Button>
     )}
    </DialogFooter>
   </DialogContent>
  </Dialog>
 );
}
