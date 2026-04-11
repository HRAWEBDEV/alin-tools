'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaUserCircle } from 'react-icons/fa';
import { useProfileContext } from '../(home)/(tablet)/room-devision/services/profile/profileContext';

function ProfileButton() {
 const { toggleProfile } = useProfileContext();
 const [mounted, setIsMounted] = useState(false);

 // mode icon
 const modeButton = (
  <Button
   type='button'
   variant='outline'
   size='icon-lg'
   className='rounded-full size-11 bg-transparent text-neutral-600 dark:text-neutral-400'
   onClick={() => toggleProfile()}
  >
   <FaUserCircle className='size-6' />
  </Button>
 );

 useEffect(() => {
  setIsMounted(true);
 }, []);

 if (!mounted) return <>{modeButton}</>;

 return <>{modeButton}</>;
}

export { ProfileButton };
