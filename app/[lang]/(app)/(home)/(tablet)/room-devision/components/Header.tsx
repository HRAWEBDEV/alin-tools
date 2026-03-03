import Tools from './Tools';
import LogoShape from './LogoShape';

export default function Header() {
 return (
  <header className='lg:hidden shrink-0 fixed start-0 top-0 end-0 lg:start-(--app-restaurant-nav-width) h-(--app-restaurant-header-height) z-(--app-restaurant-header-zindex) border-b border-input flex items-center justify-between px-4 bg-neutral-100 dark:bg-neutral-900'>
   <div>
    <LogoShape width='3.5rem' height='3.5rem' />
   </div>
   <div></div>
   <div>
    <Tools flexReverse />
   </div>
  </header>
 );
}
