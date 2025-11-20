import { ModeControllerButton } from '@/app/[lang]/(app)/components/ModeContoller';
import { LocaleControllerButton } from '@/app/[lang]/(app)/components/LocaleController';

export default function Header() {
 return (
  <header className='shrink-0 fixed start-0 top-0 end-0 lg:start-(--app-restaurant-nav-width) h-(--app-restaurant-header-height) z-(--app-restaurant-header-zindex) border-b border-input flex items-center justify-between px-4'>
   <div></div>
   <div></div>
   <div className='flex gap-2'>
    <ModeControllerButton />
    <LocaleControllerButton />
   </div>
  </header>
 );
}
