import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { FaSearch } from 'react-icons/fa';
import { Checkbox } from '@/components/ui/checkbox';
import {
 InputGroup,
 InputGroupInput,
 InputGroupAddon,
 InputGroupTextarea,
} from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronsUpDown } from 'lucide-react';
import {
 Drawer,
 DrawerTrigger,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';

export default function OrderInfo({ dic }: { dic: NewOrderDictionary }) {
 return (
  <form onSubmit={(e) => e.preventDefault()} className='py-5 px-1'>
   <FieldGroup className='grid grid-cols-2 gap-5'>
    {/* salon name       */}
    <Drawer>
     <DrawerTrigger asChild>
      <Field>
       <FieldLabel>{dic.orderInfo.salonName}</FieldLabel>
       <Button
        variant='outline'
        role='combobox'
        className='p-2 pe-1! h-auto text-start grow overflow-hidden'
        size='lg'
       >
        <p className='grow text-ellipsis overflow-hidden'>سالن شماره یک</p>
        <ChevronsUpDown className='opacity-50 size-6' />
       </Button>
      </Field>
     </DrawerTrigger>
     <DrawerContent className='h-[80svh]'>
      <DrawerHeader className='hidden'>
       <DrawerTitle></DrawerTitle>
      </DrawerHeader>
      <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
       <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
        {dic.orderInfo.salonName}
       </h1>
       <div className='w-[20rem]'>
        <InputGroup>
         <InputGroupInput
          placeholder={dic.orderInfo.search + ' ...'}
          type='search'
         />
         <InputGroupAddon align='inline-end'>
          <FaSearch className='text-primary size-4' />
         </InputGroupAddon>
        </InputGroup>
       </div>
      </div>
      <div>
       <ul>
        {Array.from({ length: 3 }, (_, i) => i).map((i) => (
         <li className='flex gap-1 items-center ps-6 py-2' key={i}>
          <Checkbox tabIndex={-1} className='size-6' defaultChecked={i === 0} />
          <Button
           variant='ghost'
           className='w-full justify-start h-auto text-lg'
          >
           <span>سالن شماره {i + 1}</span>
          </Button>
         </li>
        ))}
       </ul>
      </div>
     </DrawerContent>
    </Drawer>
    {/* table name       */}
    <Drawer>
     <DrawerTrigger asChild>
      <Field>
       <FieldLabel>{dic.orderInfo.table}</FieldLabel>
       <Button
        variant='outline'
        role='combobox'
        className='p-2 pe-1! h-auto text-start grow overflow-hidden'
        size='lg'
       >
        <p className='grow text-ellipsis overflow-hidden'>سالن شماره یک</p>
        <ChevronsUpDown className='opacity-50 size-6' />
       </Button>
      </Field>
     </DrawerTrigger>
     <DrawerContent className='h-[80svh]'>
      <DrawerHeader className='hidden'>
       <DrawerTitle></DrawerTitle>
      </DrawerHeader>
      <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
       <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
        {dic.orderInfo.table}
       </h1>
       <div className='w-[20rem]'>
        <InputGroup>
         <InputGroupInput
          placeholder={dic.orderInfo.search + ' ...'}
          type='search'
         />
         <InputGroupAddon align='inline-end'>
          <FaSearch className='text-primary size-4' />
         </InputGroupAddon>
        </InputGroup>
       </div>
      </div>
      <div>
       <ul>
        {Array.from({ length: 3 }, (_, i) => i).map((i) => (
         <li className='flex gap-1 items-center ps-6 py-2' key={i}>
          <Checkbox tabIndex={-1} className='size-6' defaultChecked={i === 0} />
          <Button
           variant='ghost'
           className='w-full justify-start h-auto text-lg'
          >
           <span>سالن شماره {i + 1}</span>
          </Button>
         </li>
        ))}
       </ul>
      </div>
     </DrawerContent>
    </Drawer>
    <Field>
     <FieldLabel htmlFor='customer'>{dic.orderInfo.customer}</FieldLabel>
     <InputGroup>
      <InputGroupInput id='customer' />
     </InputGroup>
    </Field>
    <Field>
     <FieldLabel htmlFor='guestCount'>{dic.orderInfo.guestCount}</FieldLabel>
     <InputGroup>
      <InputGroupInput id='guestCount' />
     </InputGroup>
    </Field>
    <Field>
     <FieldLabel htmlFor='discount'>{dic.orderInfo.discountRate}</FieldLabel>
     <InputGroup>
      <InputGroupInput id='discount' />
     </InputGroup>
    </Field>
    <Field>
     <FieldLabel htmlFor='bonNo'>{dic.orderInfo.bonNo}</FieldLabel>
     <InputGroup>
      <InputGroupInput id='bonNo' />
     </InputGroup>
    </Field>
    <Field className='col-span-2'>
     <FieldLabel htmlFor='description'>{dic.orderInfo.description}</FieldLabel>
     <InputGroup>
      <InputGroupTextarea id='description' />
     </InputGroup>
    </Field>
   </FieldGroup>
  </form>
 );
}
