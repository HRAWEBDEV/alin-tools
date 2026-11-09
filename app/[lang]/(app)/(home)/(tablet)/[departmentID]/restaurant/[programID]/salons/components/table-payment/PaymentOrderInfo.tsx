import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangleIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { type Combo } from '../../../../utils/apiTypes';
import { Dispatch, SetStateAction } from 'react';

export default function PaymentOrderInfo({
 dic,
 ordersList,
 activeOrderId,
 setActiveOrderId,
}: {
 dic: SalonsDictionary;
 ordersList: Combo[];
 activeOrderId: number;
 setActiveOrderId: Dispatch<SetStateAction<number>>;
}) {
 const { localeInfo } = useBaseConfig();
 return (
  <div className='my-2'>
   <Alert className='text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500'>
    <AlertTriangleIcon />
    <AlertTitle className='hidden'></AlertTitle>
    <AlertDescription className='text-inherit'>
     {dic.orderPayment.thisTableHasMoreThanOneOrder}.
    </AlertDescription>
   </Alert>
   <div className='mt-4'>
    <RadioGroup
     dir={localeInfo.contentDirection}
     value={activeOrderId.toString()}
     onValueChange={(value) => {
      setActiveOrderId(Number(value));
     }}
    >
     {ordersList.map((order) => (
      <Field
       key={order.key}
       orientation='horizontal'
       className='p-4 border border-border rounded-md'
       onClick={() => setActiveOrderId(Number(order.key))}
      >
       <RadioGroupItem value={order.key} id={order.key} className='scale-150' />
       <FieldContent>
        <FieldLabel htmlFor={order.key}>
         <span>{dic.orderPayment.orderNo}: </span>
         <span>{order.value}</span>
        </FieldLabel>
       </FieldContent>
      </Field>
     ))}
    </RadioGroup>
   </div>
  </div>
 );
}
