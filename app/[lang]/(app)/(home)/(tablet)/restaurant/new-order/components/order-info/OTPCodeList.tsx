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

export default function OTPCodeList({ dic }: { dic: NewOrderDictionary }) {
 const [codes, setCodes] = useState<string[]>([]);
 const [otpCode, setOtpCode] = useState<string>('');
 const [mode, setMode] = useState<'edit' | 'insert'>('insert');
 const inputRef = useRef<HTMLInputElement>(null);
 return (
  <DialogContent className='flex flex-col w-full max-h-dvh sm:w-[min(95%,25rem)] sm:max-h-[80svh] max-w-none! p-0 overflow-hidden'>
   <DialogHeader className='p-4 py-1'>
    <DialogTitle className='hidden'>{dic.addOTPModal.title}</DialogTitle>
    <DialogDescription className='hidden'></DialogDescription>
   </DialogHeader>
   <div className='grow overflow-auto p-4 pt-0 scroll-smooth'>
    <form className='sticky top-0 bg-background mb-4'>
     <FieldGroup className='gap-2'>
      <Field className='gap-3'>
       <FieldLabel htmlFor='addwalletOtpCode'>
        {dic.orderInfo.walletOtpCode}
       </FieldLabel>
       <InputGroup className='h-11'>
        <NumericFormat
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
       onClick={(e) => {
        e.preventDefault();
        const trimmedOtpCode = otpCode.trim();
        if (!trimmedOtpCode) {
        } else if (codes.some((item) => item === trimmedOtpCode)) {
         toast.error(dic.addOTPModal.duplicateOtpCode);
        } else {
         setCodes((prev) => [...prev, trimmedOtpCode]);
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
     {codes.length ? (
      <div>
       <h3 className='mb-2'>
        {dic.addOTPModal.addedCodes} ({codes.length}):{' '}
       </h3>
       <ul className='grid gap-3'>
        {codes.map((code) => (
         <li key={code}>
          <Button
           type='button'
           className='w-full h-11 p-0'
           variant='outline'
           // onClick={() => {
           //  setMode('edit');
           //  setOtpCode(code);
           // }}
          >
           <div className='basis-18'></div>
           <div className='grow'>
            <span>{code}</span>
           </div>
           <div className='basis-18 flex justify-end'>
            <Button
             className='text-destructive h-full rounded-ss-none rounded-es-none border-y-0 border-e-0'
             variant='outline'
             type='button'
             onClick={(e) => {
              e.stopPropagation();
              setCodes(codes.filter((c) => c !== code));
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
