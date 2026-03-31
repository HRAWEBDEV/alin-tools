import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { ResidentGuest } from '../services/guestsListApiActions';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import Link from 'next/link';
import type { Route } from 'next';
import { ResidentGuestsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/resident-guests/dictionary';

export default function GuestDetailDrawer({
 guest,
 dic,
 onClose,
}: {
 guest: ResidentGuest | null;
 dic: ResidentGuestsDictionary;
 onClose: () => void;
}) {
 const { locale } = useBaseConfig();

 return (
  <Drawer open={!!guest} onOpenChange={(open) => !open && onClose()}>
   <DrawerContent dir='rtl' className='h-auto! sm:min-h-auto min-h-[89svh] '>
    <DrawerHeader>
     <DrawerTitle>{dic.detail.title}</DrawerTitle>
    </DrawerHeader>
    {guest && (
     <div className='grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-x-8 gap-y-4 p-4 text-sm sm:justify-items-center justify-items-normal max-w-[70%] w-full mx-auto'>
      <DetailRow label={dic.fields.roomNo} value={guest.roomNo} />
      <DetailRow label={dic.fields.reserveNo} value={guest.reserveNo} />
      <DetailRow
       label={dic.fields.fullName}
       value={guest.guestFullName}
       valueClassName='text-primary'
      />
      <DetailRow label={dic.fields.fatherName} value={guest.fatherName} />
      <DetailRow label={dic.fields.floor} value={guest.floorNo} />
      <DetailRow label={dic.fields.roomType} value={guest.roomTypeName} />
      <DetailRow
       label={dic.fields.checkIn}
       value={
        guest.checkinDateTime
         ? new Date(guest.checkinDateTimeOffset).toLocaleDateString(locale)
         : '-'
       }
       valueClassName='text-secondary'
      />
      <DetailRow
       label={dic.fields.checkOut}
       value={
        guest.registerDepatureDateTimeOffset
         ? new Date(guest.registerDepatureDateTimeOffset).toLocaleDateString(
            locale,
           )
         : '-'
       }
       valueClassName='text-destructive'
      />

      <DetailRow label={dic.fields.customerName} value={guest.customerName} />
      <DetailRow
       label={dic.filters.nationality}
       value={guest.nationalityName}
      />
      <DetailRow
       label={dic.fields.phoneNumber}
       value={guest.mobileNo}
       valueClassName='text-primary hover:border border border-b border-transparent hover:border-b hover:border-b-primary'
       isLink
      />
      <DetailRow
       label={dic.fields.email}
       value={guest.email}
       valueClassName='text-primary hover:border border border-b border-transparent hover:border-b hover:border-b-primary'
       isLink
      ></DetailRow>
      <DetailRow label={dic.fields.homeCity} value={guest.sourceCityName} />
      <DetailRow label={dic.fields.address} value={guest.homeAddress} />
      <DetailRow label={dic.fields.gender} value={guest.genderName} />
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
  <div className='flex items-center text-start gap-2 sm:justify-start justify-between sm:px-0 px-4'>
   <span className='text-muted-foreground'>
    {label}
    {' : '}
   </span>
   {isLink && value ? (
    <Link href={linkValue as Route} className={valueClassName}>
     {value}
    </Link>
   ) : (
    <span className={`font-medium border-none! ${valueClassName}`}>
     {value ?? '—'}
    </span>
   )}
  </div>
 );
}
