import Logo from './Logo';
import NavProfile from './NavProfile';
import Link from 'next/link';
import { ModeControllerButton } from '@/app/[lang]/(app)/components/ModeContoller';
import { LocaleControllerButton } from '@/app/[lang]/(app)/components/LocaleController';

export default function Nav() {
 return (
  <nav className='overflow-auto shrink-0 basis-(--app-restaurant-nav-width) bg-neutral-100 dark:bg-neutral-900 p-4 flex flex-col pt-2'>
   <div className='flex gap-4'>
    <LocaleControllerButton />
    <ModeControllerButton />
   </div>
   <div>
    <Link href='#'>
     <Logo />
    </Link>
   </div>
   <div className='grow'></div>
   <NavProfile />
  </nav>
 );
}
