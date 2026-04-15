'use client';
import { useEffect, useState, useMemo } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerFooter,
 DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import {
 Trash2Icon,
 RotateCcwIcon,
 PencilIcon,
 ChevronsUpDown,
 ChevronDownIcon,
} from 'lucide-react';

import {
 saveRegisterRevenue,
 updateRegisterRevenue,
 deleteRevenue,
 revertRevenue,
 type Revenue,
 type RegisterInfo,
} from '../services/guestsExpensesApiActions';
import type { GuestsExpensesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-expenses/dictionary';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { FaRegTrashAlt, FaTimes } from 'react-icons/fa';
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';

export type InitData = {
 rooms: { key: string; value: string }[];
 items: {
  key: string;
  value: string;
  price?: number;
  serviceRate?: number | null;
  taxRate?: number | null;
 }[];
};

type DrawerMode = 'create' | 'edit' | 'view' | null;

type Props = {
 isOpen: boolean;
 mode: DrawerMode;
 expense: Revenue | null;
 registerInfo: RegisterInfo | null;
 initData: InitData | undefined;
 dic: GuestsExpensesDictionary;
 onClose: () => void;
 onSuccess: () => void;
 onSetMode: (mode: DrawerMode) => void;
};

const calcPercentage = ({ value, base }: { value: number; base: number }) => {
 if (base === 0) return 0;
 return Number(((value / base) * 100).toFixed(2));
};

const calcPrice = ({ value, base }: { value: number; base: number }) => {
 return Number(((value * base) / 100).toFixed(4));
};

const calculateServiceAndTax = ({
 rate,
 sValue,
 discount,
}: {
 rate: number;
 sValue: number;
 discount: number;
}) => Number((((sValue - discount) * rate) / 100).toFixed(4));

const deriveRate = ({
 price,
 sValue,
 discount,
}: {
 price: number;
 sValue: number;
 discount: number;
}) => {
 const base = sValue - discount;
 if (base === 0) return 0;
 return Number(((price / base) * 100).toFixed(2));
};

const expenseFormSchema = z.object({
 itemID: z.string().min(1, 'Item is required'),
 roomID: z.number().min(1).nullable(),
 date: z.date().nullable(),
 amount: z
  .number()
  .nullable()
  .refine((val) => val !== null && val >= 1, 'Quantity must be at least 1'),
 unitPrice: z
  .number()
  .nullable()
  .refine((val) => val !== null && val >= 0, 'Unit price is required'),
 discountPrice: z.number().nullable(),
 discountRate: z.number().nullable(),
 comment: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

const SHARED_DRAWER_CLASSES =
 'sm:h-[min(85svh,30rem)] h-[min(95svh,66rem)] flex flex-col';

function DetailRow({
 label,
 value,
 wrapperClassName = '',
 valueClassName = '',
 dic,
}: {
 label: string;
 value: string | number | null | undefined;
 wrapperClassName?: string;
 valueClassName?: string;
 dic?: GuestsExpensesDictionary;
}) {
 return (
  <div
   className={`flex items-center text-start gap-2 justify-between w-full ${wrapperClassName}`}
  >
   <span className='text-muted-foreground whitespace-nowrap'>{label}:</span>
   <span className={`font-normal text-end sm:text-start ${valueClassName}`}>
    {value ?? dic?.info.rial}
   </span>
  </div>
 );
}

export default function GuestsExpenseActionDrawer({
 isOpen,
 mode,
 expense,
 registerInfo,
 initData,
 dic,
 onClose,
 onSuccess,
 onSetMode,
}: Props) {
 const isReadOnly = mode === 'view';
 const { locale } = useBaseConfig();
 const [confirmAction, setConfirmAction] = useState<'delete' | 'revert' | null>(
  null,
 );
 const [itemDrawerOpen, setItemDrawerOpen] = useState(false);
 const [roomDrawerOpen, setRoomDrawerOpen] = useState(false);
 const [discountMode, setDiscountMode] = useState<'fixed' | 'percent'>('fixed');
 const [showDatePicker, setShowDatePicker] = useState(false);
 const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

 if (isOpen !== prevIsOpen) {
  setPrevIsOpen(isOpen);
  if (isOpen) {
   setDiscountMode('fixed');
  }
 }

 const {
  control,
  handleSubmit,
  reset,
  setValue,
  formState: { errors },
 } = useForm<ExpenseFormValues>({
  resolver: zodResolver(expenseFormSchema),
  defaultValues: {
   itemID: '',
   amount: 1,
   unitPrice: 0,
   discountPrice: 0,
   discountRate: 0,
   comment: '',
   roomID: null,
   date: null,
  },
 });

 const watchedValues = useWatch({ control });

 const rates = useMemo(() => {
  if (expense && (mode === 'edit' || mode === 'view')) {
   return {
    serviceRate: deriveRate({
     price: expense.service,
     sValue: expense.sValue,
     discount: expense.discount,
    }),
    taxRate: deriveRate({
     price: expense.tax,
     sValue: expense.sValue,
     discount: expense.discount,
    }),
   };
  }
  if (mode === 'create') {
   const selectedItem = initData?.items.find(
    (i) => i.key === watchedValues.itemID,
   );
   return {
    serviceRate: selectedItem?.serviceRate ?? 0,
    taxRate: selectedItem?.taxRate ?? 0,
   };
  }
  return { serviceRate: 0, taxRate: 0 };
 }, [expense, mode, initData?.items, watchedValues.itemID]);

 const sValue = (watchedValues.unitPrice ?? 0) * (watchedValues.amount ?? 0);
 const computedService = calculateServiceAndTax({
  rate: rates.serviceRate,
  sValue,
  discount: watchedValues.discountPrice ?? 0,
 });
 const computedTax = calculateServiceAndTax({
  rate: rates.taxRate,
  sValue,
  discount: watchedValues.discountPrice ?? 0,
 });
 const computedTotal =
  sValue - (watchedValues.discountPrice ?? 0) + computedService + computedTax;

 useEffect(() => {
  if (!isOpen) return;

  if (expense && (mode === 'edit' || mode === 'view')) {
   const unitPrice = expense.amount > 0 ? expense.sValue / expense.amount : 0;
   reset({
    itemID: String(expense.itemID),
    amount: expense.amount,
    unitPrice,
    discountPrice: expense.discount,
    discountRate: calcPercentage({
     value: expense.discount,
     base: expense.sValue,
    }),
    comment: expense.comment || '',
    roomID: expense.roomID,
    date: new Date(expense.dateTimeDateTimeOffset),
   });
  } else if (mode === 'create') {
   reset({
    itemID: '',
    amount: 1,
    unitPrice: 0,
    discountPrice: 0,
    discountRate: 0,
    comment: '',
    roomID: null,
    date: new Date(),
   });
  }
 }, [isOpen, expense, mode, reset]);

 const { mutate: mutateSave, isPending: isSaving } = useMutation({
  mutationFn: saveRegisterRevenue,
  onSuccess: () => {
   onSuccess();
   onClose();
  },
 });

 const { mutate: mutateUpdate, isPending: isUpdating } = useMutation({
  mutationFn: updateRegisterRevenue,
  onSuccess: () => {
   onSuccess();
   onClose();
  },
 });

 const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
  mutationFn: deleteRevenue,
  onSuccess: () => {
   onSuccess();
   onClose();
  },
 });

 const { mutate: mutateRevert, isPending: isReverting } = useMutation({
  mutationFn: revertRevenue,
  onSuccess: () => {
   onSuccess();
   onClose();
  },
 });

 const isProcessing = isSaving || isUpdating || isDeleting || isReverting;

 const arzsArray = registerInfo?.arzs as unknown as Array<{ value: string }>;
 const currencyName = arzsArray?.length
  ? arzsArray[0].value
  : expense?.arzName || dic.info.rial;

 const selectedItemLabel = useMemo(
  () =>
   initData?.items.find((i) => i.key === watchedValues.itemID)?.value ?? null,
  [watchedValues.itemID, initData?.items],
 );

 const selectedRoomLabel = useMemo(
  () =>
   initData?.rooms.find((i) => Number(i.key) === watchedValues.roomID)?.value ??
   null,
  [initData?.rooms, watchedValues.roomID],
 );

 const handleItemSelect = (key: string) => {
  setValue('itemID', key, { shouldValidate: true });
  const item = initData?.items.find((i) => i.key === key);
  if (item?.price !== undefined) setValue('unitPrice', item.price);
  setItemDrawerOpen(false);
 };

 const onSubmit = (values: ExpenseFormValues) => {
  const registerID = registerInfo?.register.id ?? expense?.registerID ?? null;
  const roomID =
   mode === 'create'
    ? values.roomID
    : (expense?.roomID ?? registerInfo?.register.roomID ?? null);

  if (registerID == null || roomID == null) {
   toast.error(dic.info.onSubmitErrorMsg);
   return;
  }

  const amount = values.amount ?? 0;
  const unitPrice = values.unitPrice ?? 0;
  const discountPrice = values.discountPrice ?? 0;

  const newSValue = unitPrice * amount;
  const newService = calculateServiceAndTax({
   rate: rates.serviceRate,
   sValue: newSValue,
   discount: discountPrice,
  });
  const newTax = calculateServiceAndTax({
   rate: rates.taxRate,
   sValue: newSValue,
   discount: discountPrice,
  });

  const effectiveDate = values.date
   ? new Date(values.date).toISOString()
   : new Date().toISOString();

  const revenuePayload: Revenue = {
   ...(expense || {}),
   id: expense?.id || 0,
   registerID: registerID,
   roomID: roomID,
   itemID: Number(values.itemID),
   amount: values.amount ?? 0,
   sValue: newSValue,
   discount: discountPrice,
   service: newService,
   tax: newTax,
   comment: values.comment || null,
   dateTimeDateTimeOffset: effectiveDate,
   arzID: expense?.arzID || 0,
   progrmID: expense?.progrmID || 0,
   entityValue: expense?.entityValue || 0,
   totalValue: newSValue - discountPrice + newService + newTax,
  } as Revenue;
  const payload = {
   registerID: registerID,
   roomID: roomID,
   revenues: [revenuePayload],
  };

  if (mode === 'create') {
   mutateSave(payload);
  } else {
   mutateUpdate(payload);
  }
 };

 const viewUnitPrice =
  expense && expense.amount > 0 ? expense.sValue / expense.amount : 0;
 const viewDiscountRate = expense
  ? calcPercentage({ value: expense.discount, base: expense.sValue })
  : 0;
 const viewServiceRate = expense
  ? deriveRate({
     price: expense.service,
     sValue: expense.sValue,
     discount: expense.discount,
    })
  : 0;
 const viewTaxRate = expense
  ? deriveRate({
     price: expense.tax,
     sValue: expense.sValue,
     discount: expense.discount,
    })
  : 0;

 return (
  <>
   <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <DrawerContent
     className='sm:h-[min(85svh,44rem)] h-[min(95svh,56rem)] flex flex-col'
     dir='rtl'
    >
     <DrawerHeader className='shrink-0'>
      <DrawerTitle>
       {mode === 'create'
        ? dic.actions?.addExpense
        : mode === 'edit'
          ? dic.actions?.editExpense
          : dic.actions?.viewExpense}
      </DrawerTitle>

      <DrawerClose className='absolute top-5 start-5 cursor-pointer' asChild>
       <Button size='icon-lg' variant='outline'>
        <FaTimes className='size-6' />
       </Button>
      </DrawerClose>
     </DrawerHeader>

     <div className='p-5 pt-0 flex-1 overflow-y-auto w-full max-w-[min(100%,40rem)] mx-auto'>
      {isReadOnly ? (
       expense && (
        <div className='grid sm:grid-cols-2 grid-cols-1 gap-x-10 gap-y-4 py-4'>
         <DetailRow
          wrapperClassName=''
          label={dic.fields?.date}
          value={new Date(expense.dateTimeDateTimeOffset).toLocaleDateString(
           locale,
          )}
         />
         <DetailRow label={dic.fields?.currency} value={currencyName} />
         <DetailRow
          label={dic.fields?.item}
          value={expense.itemName}
          valueClassName='text-primary'
         />
         <DetailRow label={dic.fields?.room} value={expense.roomLabel} />
         <DetailRow
          label={dic.fields?.unitPrice}
          value={viewUnitPrice.toLocaleString()}
         />
         <DetailRow
          label={dic.fields?.amount}
          value={expense.amount.toLocaleString()}
         />
         <DetailRow
          label={dic.fields?.price}
          value={expense.sValue.toLocaleString()}
         />
         <DetailRow
          label={dic.fields?.discount}
          value={
           expense.discount > 0
            ? `${expense.discount.toLocaleString()} (%${viewDiscountRate})`
            : '—'
          }
         />
         <DetailRow
          label={dic.fields?.serviceRate}
          value={`%${viewServiceRate}`}
         />
         <DetailRow label={dic.fields?.taxRate} value={`%${viewTaxRate}`} />
         <DetailRow
          label={dic.fields?.total}
          value={expense.totalValue?.toLocaleString()}
         />
         {expense.comment && (
          <div className='sm:col-span-2 sm:border-t pt-4'>
           <DetailRow
            wrapperClassName='flex-col items-stretch'
            label={dic.fields?.comment}
            value={expense.comment}
           />
          </div>
         )}
        </div>
       )
      ) : (
       <form
        id='expense-form'
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-6 pt-4'
       >
        <Controller
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
        />
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
             onClick={() => setItemDrawerOpen(true)}
             className='justify-between h-11 font-normal'
             ref={field.ref}
             onBlur={field.onBlur}
            >
             <span className='text-start grow overflow-hidden text-ellipsis'>
              {selectedItemLabel ?? (
               <span className='text-muted-foreground'>
                {dic.placeholders?.selectItem}
               </span>
              )}
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
            onOpenChange={(open) => !open && setItemDrawerOpen(false)}
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
              <FieldLabel htmlFor='roomSelector'>
               {dic.placeholders.room}
              </FieldLabel>
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
                    field.onChange(
                     field.value === numericKey ? null : numericKey,
                    );
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
          disabled
          className='bg-muted/50'
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
           />
           {errors.amount && (
            <span className='text-xs text-destructive'>
             {errors.amount.message}
            </span>
           )}
          </Field>
         )}
        />

        <Field>
         <FieldLabel>{dic.fields?.price || 'Price'}</FieldLabel>
         <Input
          value={sValue.toLocaleString()}
          readOnly
          disabled
          className='bg-muted/50'
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
              disabled={isProcessing || sValue === 0}
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
           disabled
           className='bg-muted/50 w-24 shrink-0'
          />
          <Input
           value={computedService.toLocaleString()}
           readOnly
           disabled
           className='bg-muted/50 flex-1'
          />
         </div>
        </Field>

        <Field>
         <FieldLabel>{dic.fields?.taxRate}</FieldLabel>
         <div className='flex gap-2'>
          <Input
           value={`%${rates.taxRate}`}
           readOnly
           disabled
           className='bg-muted/50 w-24 shrink-0'
          />
          <Input
           value={computedTax.toLocaleString()}
           readOnly
           disabled
           className='bg-muted/50 flex-1'
          />
         </div>
        </Field>

        <Field>
         <FieldLabel>{dic.fields?.total || 'Total'}</FieldLabel>
         <Input
          value={computedTotal.toLocaleString()}
          readOnly
          disabled
          className='bg-muted/50'
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
      )}
     </div>

     <DrawerFooter className='shrink-0 flex-row justify-between gap-3 bg-background border-t p-4 sm:px-0 max-w-[min(100%,40rem)] mx-auto w-full'>
      <div className='flex gap-2'>
       {expense?.id && (mode === 'edit' || mode === 'view') && (
        <>
         <Button
          type='button'
          variant='destructive'
          disabled={isProcessing}
          onClick={() => setConfirmAction('delete')}
         >
          <Trash2Icon className='h-4 w-4' />
          <span className='sm:inline hidden'>{dic.actions.deleteExpense}</span>
         </Button>
         <Button
          type='button'
          variant='outline'
          disabled={isProcessing}
          onClick={() => setConfirmAction('revert')}
         >
          <RotateCcwIcon className='h-4 w-4' />
          <span className='sm:inline hidden'>{dic.actions.revertExpense}</span>
         </Button>
        </>
       )}
      </div>
      <div className='flex gap-2'>
       {mode === 'view' && (
        <Button
         type='button'
         disabled={isProcessing}
         onClick={() => onSetMode('edit')}
         className='px-6'
        >
         <PencilIcon className=' h-4 w-4 sm:rtl:ml-2 rtl:mr-0' />
         <span className='sm:inline hidden'>{dic.actions?.edit}</span>
        </Button>
       )}

       {(mode === 'create' || mode === 'edit') && (
        <Button type='submit' form='expense-form' disabled={isProcessing}>
         {isProcessing && (
          <Spinner className='mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0' />
         )}
         <span className='sm:inline hidden'>{dic.actions?.save}</span>
        </Button>
       )}
      </div>
     </DrawerFooter>
    </DrawerContent>
   </Drawer>

   <Dialog
    open={confirmAction !== null}
    onOpenChange={(open) => !open && setConfirmAction(null)}
   >
    <DialogContent className='text-right!' dir='rtl'>
     <DialogHeader className='gap-4'>
      <DialogTitle>
       {confirmAction === 'delete'
        ? dic.actions?.deleteExpense
        : dic.actions?.revertExpense}
      </DialogTitle>
      <DialogDescription className='flex justify-start text-right'>
       {confirmAction === 'delete'
        ? dic.actions?.deleteDescription
        : dic.actions?.revertDescription}
      </DialogDescription>
     </DialogHeader>
     <DialogFooter className='gap-1 sm:gap-2 flex-row'>
      <Button
       variant='outline'
       disabled={isProcessing}
       onClick={() => setConfirmAction(null)}
       className='sm:w-fit sm:flex-0 flex-1'
      >
       {dic.actions?.cancel}
      </Button>
      <Button
       variant={confirmAction === 'delete' ? 'destructive' : 'default'}
       disabled={isProcessing}
       onClick={() => {
        if (!expense?.id) return;
        if (confirmAction === 'delete') {
         mutateDelete(expense.id);
        } else {
         mutateRevert(expense.id);
        }
        setConfirmAction(null);
       }}
       className='sm:w-fit sm:flex-0 flex-1'
      >
       {isProcessing ? <Spinner className='h-4 w-4' /> : dic.actions?.confirm}
      </Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>
  </>
 );
}
