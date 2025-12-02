import { type LoginDictionary } from '@/internalization/app/dictionaries/login/dictionary';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginOptions({ dic }: { dic: LoginDictionary }) {
 return (
  <div className='mt-1'>
   <Button variant='link' asChild className='px-0 text-xs'>
    <Link href='#'></Link>
   </Button>
  </div>
 );
}
