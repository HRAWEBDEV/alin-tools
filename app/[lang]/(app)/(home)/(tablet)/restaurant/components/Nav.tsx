import Logo from './Logo';
import NavList from './NavList';
import NavProfile from './NavProfile';
import Link from 'next/link';
import { ModeControllerButton } from '@/app/[lang]/(app)/components/ModeContoller';
import { LocaleControllerButton } from '@/app/[lang]/(app)/components/LocaleController';

export default function Nav() {
 return (
  <nav className='hidden lg:flex  overflow-hidden shrink-0 basis-(--app-restaurant-nav-width) bg-neutral-100 dark:bg-neutral-900 flex-col border-e border-input'>
   <div className='flex gap-4 p-2'>
    <LocaleControllerButton />
    <ModeControllerButton />
   </div>
   <div className='px-2'>
    <Link href='#'>
     <Logo />
    </Link>
   </div>
   <div className='grow overflow-auto'>
    <NavList />
   </div>
   <NavProfile />
  </nav>
 );
}
