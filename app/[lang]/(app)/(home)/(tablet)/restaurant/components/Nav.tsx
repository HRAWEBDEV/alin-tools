import Logo from './Logo';
import NavList from './NavList';
import NavProfile from './NavProfile';
import Link from 'next/link';

export default function Nav() {
 return (
  <nav className='hidden lg:flex  overflow-hidden shrink-0 basis-(--app-restaurant-nav-width) bg-neutral-100 dark:bg-neutral-900 flex-col border-e border-input'>
   <div className='p-2'>
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
