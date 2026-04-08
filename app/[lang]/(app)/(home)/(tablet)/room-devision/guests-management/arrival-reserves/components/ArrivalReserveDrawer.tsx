import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import Link from 'next/link';
import type { Route } from 'next';
import type { ReserveRoom } from '../services/arrivalReservesApiActions';
import type { ArrivalReservesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/arrival-reserves/dictionary';

export default function ArrivalReserveDrawer({
 reserve,
 dic,
 onClose,
}: {
 reserve: ReserveRoom | null;
 dic: ArrivalReservesDictionary;
 onClose: () => void;
}) {
 const { locale } = useBaseConfig();

 return (
  <Drawer open={!!reserve} onOpenChange={(open) => !open && onClose()}>
   <DrawerContent className='h-[min(40svh,35rem)]'>
    <DrawerHeader>
     <DrawerTitle>{dic.detail.title}</DrawerTitle>
    </DrawerHeader>
    {reserve && (
     <div className='grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-x-8 gap-y-4 p-4 text-sm sm:justify-items-center justify-items-normal w-[min(100%,50rem)] mx-auto overflow-y-auto'>
      <DetailRow label={dic.fields.reserveNo} value={reserve.reserveNo} />

      {/* <DetailRow
       label={dic.fields.roomNo}
       value={reserve.roomNo || dic.info.notAssigned}
      /> */}

      <DetailRow
       label={dic.fields.guestFullName}
       value={reserve.name}
       valueClassName='text-primary'
      />
      <DetailRow label={dic.fields.customerName} value={reserve.customerName} />

      <DetailRow label={dic.fields.roomType} value={reserve.roomTypeName} />
      <DetailRow
       label={dic.fields.pax}
       value={`${reserve.adultCount} ${dic.info.adults} / ${reserve.childCount} ${dic.info.children}`}
      />

      <DetailRow
       label={dic.fields.arrivalDate}
       value={
        reserve.arrivalDateTimeOffset
         ? new Date(reserve.arrivalDateTimeOffset).toLocaleDateString(locale)
         : '-'
       }
       valueClassName='text-secondary'
      />
      <DetailRow
       label={dic.fields.departureDate}
       value={
        reserve.depatureDateTimeOffset
         ? new Date(reserve.depatureDateTimeOffset).toLocaleDateString(locale)
         : '-'
       }
       valueClassName='text-destructive'
      />

      {/* {reserve.mobileNo && (
       <DetailRow
        label={dic.fields.phoneNumber}
        value={reserve.mobileNo}
        valueClassName='text-primary hover:border border border-b border-transparent hover:border-b hover:border-b-primary'
        isLink
       />
      )} */}

      {/* {reserve.email && (
       <DetailRow
        label={dic.fields.email}
        value={reserve.email}
        valueClassName='text-primary hover:border border border-b border-transparent hover:border-b hover:border-b-primary'
        isLink
       />
      )} */}
     </div>
    )}
   </DrawerContent>
  </Drawer>
 );
}

function DetailRow({
 label,
 value,
 valueClassName = '',
 isLink = false,
}: {
 label: string;
 value: string | number | null | undefined;
 valueClassName?: string;
 isLink?: boolean;
}) {
 const stringValue = String(value ?? '');
 let linkValue = stringValue;

 if (isLink && value) {
  if (stringValue.startsWith('http://') || stringValue.startsWith('https://')) {
   linkValue = stringValue;
  } else if (
   /^[\d\s\+\-\(\)]+$/.test(stringValue.trim()) &&
   stringValue.replace(/\D/g, '').length >= 10
  ) {
   linkValue = `tel:${stringValue}`;
  } else if (stringValue.includes('@')) {
   linkValue = `mailto:${stringValue}`;
  }
 }

 return (
  <div className='flex items-center text-start gap-2 sm:justify-start justify-between sm:px-0 px-4 w-full'>
   <span className='text-muted-foreground whitespace-nowrap'>
    {label}
    {' : '}
   </span>
   {isLink && value ? (
    <Link href={linkValue as Route} className={`truncate ${valueClassName}`}>
     {value}
    </Link>
   ) : (
    <span className={`font-medium border-none! truncate ${valueClassName}`}>
     {value ?? '—'}
    </span>
   )}
  </div>
 );
}
