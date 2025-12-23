'use client';
import { VscSearchStop } from 'react-icons/vsc';
import { Button } from '@/components/ui/button';
import { useShareDictionary } from '../services/share-dictionary/shareDictionaryContext';
import { useLogout } from '../login/hooks/useLogout';

export default function NotFound() {
 const logout = useLogout();
 const {
  shareDictionary: {
   components: { notFound },
  },
 } = useShareDictionary();
 return (
  <div className='mt-32 w-80 h-60 rounded-xl mx-auto flex flex-col items-center justify-center gap-4 text-red-800 dark:text-red-400 text-center'>
   <VscSearchStop className='size-36' />
   <div>
    <p className='text-4xl font-medium mb-2'>{notFound.title}</p>
    <p></p>
   </div>
   <Button
    className='h-12 w-32 text-xl'
    variant='destructive'
    onClick={() => {
     logout();
    }}
   >
    {notFound.goHome}
   </Button>
  </div>
 );
}
