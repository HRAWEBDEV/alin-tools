'use client';
import { useEffect, useState, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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

import { Spinner } from '@/components/ui/spinner';
import { Trash2Icon, RotateCcwIcon, PencilIcon, SaveIcon } from 'lucide-react';

import {
 saveRegisterRevenue,
 updateRegisterRevenue,
 deleteRevenue,
 revertRevenue,
 type Revenue,
 type RegisterInfo,
} from '../services/guestsExpensesApiActions';
import type { GuestsExpensesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-expenses/dictionary';
import { FaTimes } from 'react-icons/fa';
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from '@/components/ui/dialog';
// import { Calendar } from '@/components/ui/calendar';
// import {
//  Popover,
//  PopoverContent,
//  PopoverTrigger,
// } from '@/components/ui/popover';
import { toast } from 'sonner';
import ExpenseDetails from './ExpenseReadonlyDetails';
import {
 calcPercentage,
 calculateServiceAndTax,
 deriveRate,
} from '../utils/calcExpenses';
import ExpenseCreateOrEditForm from './ExpenseCreateOrEditForm';

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
 const [confirmAction, setConfirmAction] = useState<'delete' | 'revert' | null>(
  null,
 );
 const [itemDrawerOpen, setItemDrawerOpen] = useState(false);
 const [discountMode, setDiscountMode] = useState<'fixed' | 'percent'>('fixed');
 //  const [showDatePicker, setShowDatePicker] = useState(false);
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
 const isSaveDisabled =
  isProcessing ||
  !watchedValues.itemID ||
  (watchedValues.amount ?? 0) < 1 ||
  (watchedValues.unitPrice ?? -1) < 0 ||
  (mode === 'create' && !watchedValues.roomID);
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

     <div className='sm:px-0! p-5 pt-0 flex-1 overflow-y-auto w-full max-w-[min(100%,40rem)] mx-auto'>
      {isReadOnly ? (
       <ExpenseDetails
        dic={dic}
        expense={expense}
        currencyName={currencyName}
       />
      ) : (
       <ExpenseCreateOrEditForm
        dic={dic}
        mode={mode}
        initData={initData}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        control={control}
        errors={errors}
        setValue={setValue}
        watchedValues={watchedValues}
        currencyName={currencyName}
        sValue={sValue}
        computedService={computedService}
        computedTax={computedTax}
        computedTotal={computedTotal}
        rates={rates}
        discountMode={discountMode}
        setDiscountMode={setDiscountMode}
        itemDrawerOpen={itemDrawerOpen}
        onItemDrawerOpen={setItemDrawerOpen}
        handleItemSelect={handleItemSelect}
        selectedItemLabel={selectedItemLabel}
        selectedRoomLabel={selectedRoomLabel}
        isProcessing={isProcessing}
       />
      )}
     </div>

     <DrawerFooter className='shrink-0 sm:flex-row flex-col justify-between gap-3 bg-background border-t p-4 sm:px-0 max-w-[min(100%,40rem)] mx-auto w-full'>
      <div className='flex gap-2'>
       {expense?.id && (mode === 'edit' || mode === 'view') && (
        <>
         <Button
          type='button'
          variant='destructive'
          disabled={isProcessing}
          className='sm:flex-0 flex-1'
          onClick={() => setConfirmAction('delete')}
         >
          <Trash2Icon className='h-4 w-4' />
          <span>{dic.actions.deleteExpense}</span>
         </Button>
         <Button
          type='button'
          variant='outline'
          disabled={isProcessing}
          className='sm:flex-0 flex-1'
          onClick={() => setConfirmAction('revert')}
         >
          <RotateCcwIcon className='h-4 w-4' />
          <span>{dic.actions.revertExpense}</span>
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
         className='px-8! sm:w-fit w-full'
        >
         <PencilIcon className=' h-4 w-4 sm:rtl:ml-2 rtl:mr-0' />
         <span>{dic.actions?.edit}</span>
        </Button>
       )}

       {(mode === 'create' || mode === 'edit') && (
        <Button
         type='submit'
         form='expense-form'
         className='sm:flex-0 flex-1 px-8!'
         disabled={isSaveDisabled}
        >
         {isProcessing && (
          <Spinner className='mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0' />
         )}
         <SaveIcon className=' h-4 w-4 sm:rtl:ml-2 rtl:mr-0' />
         <span>{dic.actions?.save}</span>
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
