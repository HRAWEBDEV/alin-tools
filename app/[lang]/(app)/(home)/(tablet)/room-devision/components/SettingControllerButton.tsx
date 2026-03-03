'use client';
import { Button } from '@/components/ui/button';
import { IoMdSettings } from 'react-icons/io';

function SettingControllerButton() {
 // mode icon
 return (
  <Button
   type='button'
   variant='outline'
   size='icon-lg'
   className='relative rounded-full size-11 bg-transparent'
  >
   <IoMdSettings className='size-6' />
  </Button>
 );
}

export { SettingControllerButton };
