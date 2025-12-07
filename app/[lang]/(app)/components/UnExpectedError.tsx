'use client';
import { MdReportGmailerrorred } from 'react-icons/md';
import { IoReload } from 'react-icons/io5';
import { useRestaurantShareDictionary } from '../(home)/(tablet)/restaurant/services/share-dictionary/restaurantShareDictionaryContext';
import { Button } from '@/components/ui/button';

export default function UnExpectedError() {
 const {
  restaurantShareDictionary: {
   components: { unExpectedError },
  },
 } = useRestaurantShareDictionary();
 return (
  <div className='w-80 h-60 rounded-xl mx-auto flex flex-col items-center justify-center gap-4 text-red-800 dark:text-red-400 text-center'>
   <MdReportGmailerrorred className='size-16' />
   <div>
    <p className='text-xl font-medium mb-2'>{unExpectedError.title}</p>
    <p>{unExpectedError.pleaseTryAgainLater}</p>
   </div>
   <Button variant='ghost' size='icon-lg'>
    <IoReload className='size-6' />
   </Button>
  </div>
 );
}
