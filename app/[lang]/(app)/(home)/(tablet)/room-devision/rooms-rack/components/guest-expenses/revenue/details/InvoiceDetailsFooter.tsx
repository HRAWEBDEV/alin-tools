import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { InvoiceDetailProps } from '../../../../utils/guest-expenses/InvoiceDetailProps';
import { calculateInvoiceTotalValue } from '../../../../utils/guest-expenses/invoiceCalculator';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';

export default function InvoiceDetailsFooter({
 dic,
 invoiceDetailProps,
}: {
 dic: RoomsRackDictionary;
 invoiceDetailProps: InvoiceDetailProps;
}) {
 const { format } = useCurrencyFormatter();
 const { totalSValue, totalDiscount, totalService, totalTax, totalValue } = (
  invoiceDetailProps.data || []
 ).reduce(
  (acc, cur) => {
   return {
    totalSValue: acc.totalSValue + cur.sValue,
    totalDiscount: acc.totalDiscount + cur.discount,
    totalService: acc.totalService + cur.service,
    totalTax: acc.totalTax + cur.tax,
    totalValue:
     acc.totalValue +
     calculateInvoiceTotalValue({
      price: cur.sValue / cur.amount,
      service: cur.service,
      amount: cur.amount,
      tax: cur.tax,
      discount: cur.discount,
     }),
   };
  },
  {
   totalSValue: 0,
   totalDiscount: 0,
   totalService: 0,
   totalTax: 0,
   totalValue: 0,
  },
 );

 return (
  <footer className='sticky bottom-0 bg-background z-3 mt-2 pt-2 border-t border-input grid gap-3 grid-cols-2 md:grid-cols-5'>
   <Field className='gap-0.5'>
    <FieldLabel>{dic.invoiceDetails.sValue}</FieldLabel>
    <InputGroup>
     <InputGroupInput
      readOnly
      value={totalSValue >= 0 ? format(totalSValue) : `( ${totalSValue} )`}
     />
    </InputGroup>
   </Field>
   <Field className='gap-0.5'>
    <FieldLabel>{dic.invoiceDetails.discount}</FieldLabel>
    <InputGroup>
     <InputGroupInput
      readOnly
      value={
       totalDiscount >= 0 ? format(totalDiscount) : `( ${totalDiscount} )`
      }
     />
    </InputGroup>
   </Field>
   <Field className='gap-0.5'>
    <FieldLabel>{dic.invoiceDetails.service}</FieldLabel>
    <InputGroup>
     <InputGroupInput
      readOnly
      value={totalService >= 0 ? format(totalService) : `( ${totalService} )`}
     />
    </InputGroup>
   </Field>
   <Field className='gap-0.5'>
    <FieldLabel>{dic.invoiceDetails.tax}</FieldLabel>
    <InputGroup>
     <InputGroupInput
      readOnly
      value={totalTax >= 0 ? format(totalTax) : `( ${totalTax} )`}
     />
    </InputGroup>
   </Field>
   <Field className='gap-0.5 col-span-2 md:col-span-1'>
    <FieldLabel>{dic.invoiceDetails.totalPrice}</FieldLabel>
    <InputGroup>
     <InputGroupInput
      readOnly
      value={totalValue >= 0 ? format(totalValue) : `( ${totalValue} )`}
     />
    </InputGroup>
   </Field>
  </footer>
 );
}
