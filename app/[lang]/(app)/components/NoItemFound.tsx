'use client';
import { FaSearch } from 'react-icons/fa';
import { useRestaurantShareDictionary } from '../(home)/(tablet)/restaurant/services/share-dictionary/restaurantShareDictionaryContext';

export default function NoItemFound() {
 const {
  restaurantShareDictionary: {
   components: { noItemFound },
  },
 } = useRestaurantShareDictionary();
 return (
  <div className='w-80 h-60 rounded-xl mx-auto flex flex-col items-center justify-center gap-6 text-neutral-500 bg-rose-50 dark:bg-rose-950'>
   <FaSearch className='size-20' />
   <span className='text-xl font-medium'>{noItemFound.title}</span>
  </div>
 );
}
