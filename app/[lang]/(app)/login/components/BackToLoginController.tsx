'use client';
import { Button } from '@/components/ui/button';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BackToLoginController() {
 const { locale } = useBaseConfig();
 const pathname = usePathname();
 return (
  <>
   {pathname.endsWith('login') ? null : (
    <Button
     type='button'
     variant='outline'
     size='icon-lg'
     className='rounded-full size-11 bg-transparent text-rose-600 dark:text-rose-400'
     asChild
    >
     <Link href={`/${locale}/login`}>
      <IoArrowBackSharp className='size-6' />
     </Link>
    </Button>
   )}
  </>
 );
}
