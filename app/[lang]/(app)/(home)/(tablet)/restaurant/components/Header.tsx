import { ModeControllerButton } from '@/app/[lang]/(app)/components/ModeContoller';
import { LocaleControllerButton } from '@/app/[lang]/(app)/components/LocaleController';
import Tools from './Tools';

export default function Header() {
 return (
  <header className='lg:hidden shrink-0 fixed start-0 top-0 end-0 lg:start-(--app-restaurant-nav-width) h-(--app-restaurant-header-height) z-(--app-restaurant-header-zindex) border-b border-input flex items-center justify-between px-4 bg-neutral-100 dark:bg-neutral-900'>
   <div></div>
   <div></div>
   <div>
    <Tools flexReverse />
   </div>
  </header>
 );
}
