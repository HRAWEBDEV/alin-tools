import {
 DialogContent,
 DialogDescription,
 DialogHeader,
 DialogTitle,
} from '@/components/ui/dialog';
import { useState, useRef } from 'react';
import { NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { NumericFormat } from 'react-number-format';
import { Button } from '@/components/ui/button';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import { BsTrash } from 'react-icons/bs';
import { toast } from 'sonner';
import { useOrderBaseConfigContext } from '../../services/order-tools/orderBaseConfigContext';

export default function OTPCodeList({
 dic,
 isEditalbe,
}: {
 dic: NewOrderDictionary;
 isEditalbe: boolean;
}) {
 const {
  orderOtps: { otpCodes, setOtpCodes },
 } = useOrderBaseConfigContext();
 const [otpCode, setOtpCode] = useState<string>('');
 const [mode, setMode] = useState<'edit' | 'insert'>('insert');
 const inputRef = useRef<HTMLInputElement>(null);

 return (
  <DialogContent className='flex flex-col w-[min(95%,25rem)] max-h-[80svh] max-w-none! p-0 overflow-hidden'>
   <DialogHeader className='p-4 py-1 pb-4'>
    <DialogTitle className='hidden'>{dic.addOTPModal.title}</DialogTitle>
    <DialogDescription className='hidden'></DialogDescription>
   </DialogHeader>
   <div className='grow overflow-auto p-4 pt-0 scroll-smooth'>
    <form className='sticky top-0 bg-background pb-4 z-1'>
     <FieldGroup className='gap-2'>
      <Field className='gap-3'>
       <FieldLabel htmlFor='addwalletOtpCode'>
        {dic.orderInfo.walletOtpCode}
       </FieldLabel>
       <InputGroup className='h-11'>
        <NumericFormat
         disabled={!isEditalbe}
         id='addwalletOtpCode'
         className='text-center font-medium'
         getInputRef={inputRef}
         value={otpCode}
         onValueChange={({ value }) => {
          setOtpCode(value);
         }}
         customInput={InputGroupInput}
         allowNegative={false}
         decimalScale={0}
         allowLeadingZeros={true}
        />
       </InputGroup>
      </Field>
      <Button
       type='submit'
       className='h-11'
       variant='secondary'
       disabled={!isEditalbe}
       onClick={(e) => {
        e.preventDefault();
        const trimmedOtpCode = otpCode.trim();
        if (!trimmedOtpCode) {
        } else if (otpCodes.some((item) => item.code === trimmedOtpCode)) {
         toast.error(dic.addOTPModal.duplicateOtpCode);
        } else {
         setOtpCodes((prev) => [
          ...prev,
          {
           code: trimmedOtpCode,
           isNew: true,
          },
         ]);
         setOtpCode('');
        }
        inputRef.current?.focus();
       }}
      >
       {mode === 'edit' ? dic.addOTPModal.edit : dic.addOTPModal.add}
      </Button>
     </FieldGroup>
    </form>
    <div>
     {otpCodes.length ? (
      <div>
       <h3 className='mb-2 text-sm text-neutral-700 dark:text-neutral-400'>
        {dic.addOTPModal.addedCodes} ({otpCodes.length}):{' '}
       </h3>
       <ul className='grid gap-3'>
        {otpCodes.map((item) => (
         <li key={item.code}>
          <Button type='button' className='w-full h-11 p-0' variant='outline'>
           <div className='basis-18'></div>
           <div className='grow'>
            <span>{item.code}</span>
           </div>
           <div className='basis-18 flex justify-end'>
            <Button
             className='text-destructive h-full rounded-ss-none rounded-es-none border-y-0 border-e-0'
             variant='outline'
             type='button'
             disabled={!isEditalbe}
             onClick={(e) => {
              e.stopPropagation();
              setOtpCodes(otpCodes.filter((c) => c.code !== item.code));
             }}
            >
             <BsTrash className='size-6' />
            </Button>
           </div>
          </Button>
         </li>
        ))}
       </ul>
      </div>
     ) : (
      <NoItemFound />
     )}
    </div>
   </div>
  </DialogContent>
 );
}
