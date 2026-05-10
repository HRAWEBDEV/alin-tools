'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import {
 Dialog,
 DialogContent,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from '@/components/ui/dialog';
import { BiError } from 'react-icons/bi';
import { useShareDictionary } from '../share-dictionary/shareDictionaryContext';
import { Button } from '@/components/ui/button';

export default function UserRegionCheck({ children }: { children: ReactNode }) {
 const {
  shareDictionary: {
   system: { countries },
   components: { userRegionCheck },
  },
 } = useShareDictionary();
 const { localeInfo, userActiveTimeZone } = useBaseConfig();
 const [notifyUserTimeZoneMismatch, setNotifyUserTimeZoneMismatch] =
  useState(false);

 useEffect(() => {
  if (!localeInfo || !localeInfo.timezone || !userActiveTimeZone) return;
  if (userActiveTimeZone !== localeInfo.timezone) {
   setNotifyUserTimeZoneMismatch(true);
  }
 }, [localeInfo, userActiveTimeZone]);

 return (
  <>
   <Dialog
    open={notifyUserTimeZoneMismatch}
    onOpenChange={(newValue) => {
     setNotifyUserTimeZoneMismatch(newValue);
    }}
   >
    <DialogContent className='p-0 gap-0'>
     <DialogHeader className='p-4'>
      <DialogTitle className='hidden'>{userRegionCheck.title}</DialogTitle>
     </DialogHeader>
     <div className='p-4'>
      <div className='flex gap-1 items-center font-medium mb-4'>
       <BiError className='size-12 text-destructive' />
       <p>
        <span>{userRegionCheck.toDisplayInformationIn}</span>
        <span className='mx-2 text-lg text-destructive'>
         {' '}
         {countries[localeInfo.country]}{' '}
        </span>
        <span>{userRegionCheck.setYourSystemDateAndTime} !</span>
       </p>
      </div>
      <div>
       <span className='text-sm text-neutral-700 dark:text-neutral-400'>
        {userRegionCheck.activeRegion}:{' '}
       </span>
       <span className='font-medium'>{userActiveTimeZone}</span>
      </div>
     </div>
     <DialogFooter className='p-4'>
      <Button
       size='lg'
       className='w-32'
       onClick={() => {
        setNotifyUserTimeZoneMismatch(false);
       }}
      >
       {userRegionCheck.okay}
      </Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>
   {!notifyUserTimeZoneMismatch && children}
  </>
 );
}
