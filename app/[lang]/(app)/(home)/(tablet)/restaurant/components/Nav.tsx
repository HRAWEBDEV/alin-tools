'use client';
import Tools from './Tools';
import Logo from './Logo';
import NavList from './NavList';
import NavProfile from './NavProfile';
import Link from 'next/link';

export default function Nav() {
 return (
  <nav className='relative hidden lg:flex overflow-hidden shrink-0 basis-(--app-restaurant-nav-width) bg-neutral-100 dark:bg-neutral-900 flex-col border-e border-input'>
   <div className='p-4 py-2 pb-0 flex gap-4 justify-center text-neutral-600 dark:text-neutral-400'>
    <Tools />
   </div>
   <div className='p-2 pt-0'>
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
