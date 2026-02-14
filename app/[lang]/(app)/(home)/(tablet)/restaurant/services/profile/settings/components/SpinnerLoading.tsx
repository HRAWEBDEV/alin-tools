import { Spinner } from '@/components/ui/spinner';
import React from 'react';

export default function SpinnerLoading() {
 return (
  <div className='flex items-center justify-center min-h-[400px] h-full w-full'>
   <Spinner className='text-gray-400 dark:text-gray-200 size-8' />
  </div>
 );
}
