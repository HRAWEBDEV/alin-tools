'use client';
import { IoIosSearch } from 'react-icons/io';
import { useShareDictionary } from '../services/share-dictionary/shareDictionaryContext';

export default function NoItemFound() {
 const {
  shareDictionary: {
   components: { noItemFound },
  },
 } = useShareDictionary();
 return (
  <div className='w-80 h-60 rounded-xl mx-auto flex flex-col items-center justify-center gap-4 text-neutral-400 dark:text-neutral-600'>
   <IoIosSearch className='size-16' />
   <span className='text-xl'>{noItemFound.title}</span>
  </div>
 );
}
