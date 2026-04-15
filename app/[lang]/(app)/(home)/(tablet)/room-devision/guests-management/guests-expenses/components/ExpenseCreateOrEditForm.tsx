import {
 Control,
 Controller,
 FieldErrors,
 UseFormHandleSubmit,
 UseFormSetValue,
} from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { GuestsExpensesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-expenses/dictionary';
import { InitData } from './GuestsExpensesActionDrawer';
import { FaRegTrashAlt } from 'react-icons/fa';
import { calcPercentage, calcPrice } from '../utils/calcExpenses';

type DrawerMode = 'create' | 'edit' | 'view' | null;
type ExpenseFormValues = {
 itemID: string;
 roomID: number | null;
 date: Date | null;
 amount: number | null;
 unitPrice: number | null;
 discountPrice: number | null;
 discountRate: number | null;
 comment?: string;
};
interface Props {
 dic: GuestsExpensesDictionary;
 mode: DrawerMode;
 initData: InitData | undefined;

 handleSubmit: UseFormHandleSubmit<ExpenseFormValues>;
 onSubmit: (values: ExpenseFormValues) => void;
 control: Control<ExpenseFormValues>;
 errors: FieldErrors<ExpenseFormValues>;
 setValue: UseFormSetValue<ExpenseFormValues>;
 watchedValues: Partial<ExpenseFormValues>;

 currencyName: string;
 sValue: number;
 computedService: number;
 computedTax: number;
 computedTotal: number;
 rates: { serviceRate: number | null; taxRate: number | null };

 discountMode: 'fixed' | 'percent';
 setDiscountMode: React.Dispatch<React.SetStateAction<'fixed' | 'percent'>>;

 itemDrawerOpen: boolean;
 onItemDrawerOpen: (open: boolean) => void;
 handleItemSelect: (key: string) => void;
 selectedItemLabel: string | null;

 selectedRoomLabel: string | null;

 isProcessing: boolean;
}
const SHARED_DRAWER_CLASSES =
 'sm:h-[min(85svh,30rem)] h-[min(95svh,66rem)] flex flex-col';
const SHARED_INPUT_HEIGHT = 'h-11!';
export default function ExpenseCreateOrEditForm({
 dic,
 handleSubmit,
 onSubmit,
 control,
 isProcessing,
 onItemDrawerOpen,
 selectedItemLabel,
 errors,
 initData,
 itemDrawerOpen,
 handleItemSelect,
 mode,
 currencyName,
 sValue,
 computedTotal,
 computedTax,
 rates,
 computedService,
 selectedRoomLabel,
 discountMode,
 watchedValues,
 setValue,
 setDiscountMode,
}: Props) {
 const [roomDrawerOpen, setRoomDrawerOpen] = useState(false);

 return (
  <form
   id='expense-form'
   onSubmit={handleSubmit(onSubmit)}
   className='flex flex-col gap-6 pt-4'
  >
   {/* <Controller
         control={control}
         name='date'
         render={({ field }) => {
          const dateValue = field.value ? new Date(field.value) : undefined;
          return (
           <Field>
            <FieldLabel htmlFor='date'>{dic.fields.date}</FieldLabel>
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
             <PopoverTrigger asChild>
              <Button
               variant='outline'
               id='date'
               disabled={isProcessing}
               className={'justify-between h-11 font-normal'}
               onBlur={field.onBlur}
               ref={field.ref}
              >
               <span className='text-start grow overflow-hidden text-ellipsis'>
                {field.value
                 ? new Date(field.value).toLocaleDateString(locale)
                 : ''}
               </span>
               <div className='flex gap-1 items-center -me-2'>
                <ChevronDownIcon className='opacity-50 size-4 shrink-0' />
               </div>
              </Button>
             </PopoverTrigger>
             <PopoverContent
              className='w-auto overflow-hidden p-0'
              align='start'
             >
              <Calendar
               mode='single'
               captionLayout='dropdown'
               className='[&]:[--cell-size:2.6rem]'
               selected={dateValue}
               defaultMonth={dateValue}
               onSelect={(newValue) => {
                if (newValue) {
                 field.onChange(newValue);
                 setShowDatePicker(false);
                }
               }}
              />
             </PopoverContent>
            </Popover>
           </Field>
          );
         }}
        /> */}
   <Controller
    control={control}
    name='itemID'
    render={({ field }) => (
     <>
      <Field>
       <FieldLabel htmlFor='itemID'>{dic.fields?.item}</FieldLabel>
       <Button
        id='itemID'
        type='button'
        variant='outline'
        disabled={isProcessing}
        onClick={() => onItemDrawerOpen(true)}
        className='justify-between h-11 font-normal'
        ref={field.ref}
        onBlur={field.onBlur}
       >
        <span className='text-start grow overflow-hidden text-ellipsis'>
         {selectedItemLabel ?? <></>}
        </span>
        <ChevronsUpDown className='opacity-50 size-4 shrink-0' />
       </Button>
       {errors.itemID && (
        <span className='text-xs text-destructive'>
         {errors.itemID.message}
        </span>
       )}
      </Field>

      <Drawer
       open={itemDrawerOpen}
       onOpenChange={(open) => !open && onItemDrawerOpen(false)}
      >
       <DrawerContent className={SHARED_DRAWER_CLASSES} dir='rtl'>
        <DrawerHeader className='shrink-0'>
         <DrawerTitle className='text-xl'>{dic.fields?.item}</DrawerTitle>
        </DrawerHeader>
        <div className='grow overflow-hidden overflow-y-auto mb-6'>
         <ul>
          {initData?.items.map((item) => (
           <li
            key={item.key}
            className='flex gap-1 items-center ps-6 py-2 cursor-pointer hover:bg-muted/50 transition-colors'
            onClick={() => handleItemSelect(item.key)}
           >
            <Checkbox
             className='size-6 pointer-events-none'
             checked={field.value === item.key}
            />
            <Button
             tabIndex={-1}
             variant='ghost'
             className='w-full justify-start h-auto text-lg pointer-events-none'
            >
             {item.value}
            </Button>
           </li>
          ))}
          {!initData?.items.length && (
           <li className='text-center my-6 font-normal text-destructive'>
            {dic.info?.noItemFound || 'No items found'}
           </li>
          )}
         </ul>
        </div>
       </DrawerContent>
      </Drawer>
     </>
    )}
   />
   {mode === 'create' && (
    <Controller
     control={control}
     name='roomID'
     render={({ field }) => {
      return (
       <>
        <Field>
         <FieldLabel htmlFor='roomSelector'>{dic.placeholders.room}</FieldLabel>
         <Button
          id='roomSelector'
          type='button'
          variant='outline'
          onClick={() => setRoomDrawerOpen(true)}
          disabled={isProcessing}
          className='justify-between h-11 font-normal'
         >
          <span className='text-start grow overflow-hidden text-ellipsis'>
           {selectedRoomLabel ?? (
            <span className='text-muted-foreground'>
             {dic.placeholders?.room}
            </span>
           )}
          </span>
          <div className='flex gap-1 items-center -me-2'>
           {field.value && (
            <Button
             type='button'
             variant='ghost'
             size='icon'
             onClick={(e) => {
              e.stopPropagation();
              field.onChange(null);
             }}
             className='text-rose-700 dark:text-rose-400 h-8 w-8 bg-transparent!'
            >
             <FaRegTrashAlt className='size-4' />
            </Button>
           )}
           <ChevronsUpDown className='opacity-50 size-4 shrink-0' />
          </div>
         </Button>
        </Field>

        <Drawer
         open={roomDrawerOpen}
         onOpenChange={(open) => !open && setRoomDrawerOpen(false)}
        >
         <DrawerContent className={SHARED_DRAWER_CLASSES} dir='rtl'>
          <DrawerHeader className='shrink-0'>
           <DrawerTitle className='text-xl'>
            {dic.placeholders.selectRoom || 'Select Room'}
           </DrawerTitle>
          </DrawerHeader>
          <div className='grow overflow-hidden overflow-y-auto mb-6'>
           <ul>
            {initData?.rooms?.map((opt) => (
             <li
              key={opt.key}
              className='flex gap-1 items-center ps-6 py-2 cursor-pointer hover:bg-muted/50 transition-colors'
              onClick={() => {
               const numericKey = Number(opt.key);
               field.onChange(field.value === numericKey ? null : numericKey);
               setRoomDrawerOpen(false);
              }}
             >
              <Checkbox
               className='size-6 pointer-events-none'
               checked={field.value === Number(opt.key)}
              />
              <Button
               tabIndex={-1}
               type='button'
               variant='ghost'
               className='w-full justify-start h-auto text-lg pointer-events-none'
              >
               <span>{opt.value}</span>
              </Button>
             </li>
            ))}
           </ul>
          </div>
         </DrawerContent>
        </Drawer>
       </>
      );
     }}
    />
   )}

   <Field>
    <FieldLabel>{dic.fields?.currency}</FieldLabel>
    <Input
     value={currencyName}
     readOnly
     className={`bg-muted/50 ${SHARED_INPUT_HEIGHT}`}
    />
   </Field>

   <Controller
    control={control}
    name='unitPrice'
    render={({ field }) => (
     <Field>
      <FieldLabel htmlFor='unitPrice'>{dic.fields?.unitPrice}</FieldLabel>
      <Input
       id='unitPrice'
       type='number'
       disabled={isProcessing}
       {...field}
       value={field.value ?? ''}
       onChange={(e) => {
        const val = e.target.value;
        field.onChange(val === '' ? null : Number(val));
       }}
       className={`bg-muted/50 ${SHARED_INPUT_HEIGHT}`}
      />
      {errors.unitPrice && (
       <span className='text-xs text-destructive'>
        {errors.unitPrice.message}
       </span>
      )}
     </Field>
    )}
   />

   <Controller
    control={control}
    name='amount'
    render={({ field }) => (
     <Field>
      <FieldLabel htmlFor='amount'>{dic.fields?.amount}</FieldLabel>
      <Input
       id='amount'
       type='number'
       disabled={isProcessing}
       {...field}
       value={field.value ?? ''}
       onChange={(e) => {
        const val = e.target.value;
        field.onChange(val === '' ? null : Number(val));
       }}
       className={`bg-muted/50 ${SHARED_INPUT_HEIGHT}`}
      />
      {errors.amount && (
       <span className='text-xs text-destructive'>{errors.amount.message}</span>
      )}
     </Field>
    )}
   />

   <Field>
    <FieldLabel>{dic.fields?.price || 'Price'}</FieldLabel>
    <Input
     value={sValue.toLocaleString()}
     readOnly
     className={`bg-muted/50 ${SHARED_INPUT_HEIGHT}`}
    />
   </Field>

   <Controller
    control={control}
    name='discountPrice'
    render={({ field }) => (
     <Field>
      <FieldLabel htmlFor='discountPrice'>
       {dic.fields?.discount || 'Discount'}
      </FieldLabel>
      <div className='flex gap-2'>
       <div className='relative flex-1'>
        <Input
         id='discountPrice'
         type='number'
         readOnly={isProcessing || sValue === 0}
         ref={field.ref}
         onBlur={field.onBlur}
         value={
          discountMode === 'fixed'
           ? (field.value ?? '')
           : (watchedValues.discountRate ?? '')
         }
         onChange={(e) => {
          const rawVal = e.target.value;

          if (rawVal === '') {
           field.onChange(null);
           setValue('discountRate', null);
           return;
          }

          const val = Number(rawVal);

          if (discountMode === 'fixed') {
           if (val > sValue) return;
           field.onChange(val);
           setValue(
            'discountRate',
            calcPercentage({ value: val, base: sValue }),
           );
          } else {
           if (val > 100) return;
           field.onChange(calcPrice({ value: val, base: sValue }));
           setValue('discountRate', val);
          }
         }}
         className={`bg-muted/50 ${SHARED_INPUT_HEIGHT}`}
        />
        <span className='absolute end-8 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none'>
         {discountMode === 'fixed' && sValue > 0
          ? `%${watchedValues.discountRate || 0}`
          : discountMode === 'percent'
            ? (watchedValues.discountPrice || 0).toLocaleString()
            : ''}
        </span>
       </div>
       <Button
        type='button'
        variant='outline'
        size='sm'
        className='shrink-0 w-12 h-9! font-mono'
        onClick={() =>
         setDiscountMode((d) => (d === 'fixed' ? 'percent' : 'fixed'))
        }
       >
        {discountMode === 'fixed' ? '#' : '%'}
       </Button>
      </div>
      {errors.discountPrice && (
       <span className='text-xs text-destructive'>
        {errors.discountPrice.message}
       </span>
      )}
     </Field>
    )}
   />

   <Field>
    <FieldLabel>{dic.fields?.serviceRate}</FieldLabel>
    <div className='flex gap-2'>
     <Input
      value={`%${rates.serviceRate}`}
      readOnly
      className={`bg-muted/50 w-24 shrink-0 ${SHARED_INPUT_HEIGHT}`}
     />
     <Input
      value={computedService.toLocaleString()}
      readOnly
      className={`bg-muted/50 ${SHARED_INPUT_HEIGHT}`}
     />
    </div>
   </Field>

   <Field>
    <FieldLabel>{dic.fields?.taxRate}</FieldLabel>
    <div className='flex gap-2'>
     <Input
      value={`%${rates.taxRate}`}
      readOnly
      className={`bg-muted/50 w-24 shrink-0 ${SHARED_INPUT_HEIGHT}`}
     />
     <Input
      value={computedTax.toLocaleString()}
      readOnly
      className={`bg-muted/50 ${SHARED_INPUT_HEIGHT}`}
     />
    </div>
   </Field>

   <Field>
    <FieldLabel>{dic.fields?.total || 'Total'}</FieldLabel>
    <Input
     value={computedTotal.toLocaleString()}
     readOnly
     className={`bg-muted/50 ${SHARED_INPUT_HEIGHT}`}
    />
   </Field>
   <Controller
    control={control}
    name='comment'
    render={({ field }) => (
     <Field>
      <FieldLabel htmlFor='comment'>
       {dic.fields?.comment || 'Comment'}
      </FieldLabel>
      <Textarea
       id='comment'
       disabled={isProcessing}
       className='resize-none h-24'
       {...field}
      />
     </Field>
    )}
   />
  </form>
 );
}
