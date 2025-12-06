'use client';
import { IoIosSearch } from 'react-icons/io';
import { useRestaurantShareDictionary } from '../(home)/(tablet)/restaurant/services/share-dictionary/restaurantShareDictionaryContext';

export default function NoItemFound() {
 const {
  restaurantShareDictionary: {
   components: { noItemFound },
  },
 } = useRestaurantShareDictionary();
 return (
  <div className='w-80 h-60 rounded-xl mx-auto flex flex-col items-center justify-center gap-4 text-neutral-400 dark:text-neutral-600'>
   <IoIosSearch className='size-16' />
   <span className='text-xl'>{noItemFound.title}</span>
  </div>
 );
}
