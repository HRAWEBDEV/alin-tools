import Tools from './Tools';
import Logo from './Logo';
import NavList from './NavList';
import NavProfile from './NavProfile';
import Link from 'next/link';
import NavWrapper from './NavWrapper';

export default function Nav() {
 return (
  <NavWrapper>
   <div className='p-4 py-2 pb-0 flex gap-4 justify-start text-neutral-600 dark:text-neutral-400'>
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
  </NavWrapper>
 );
}
