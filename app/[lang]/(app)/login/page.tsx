import { getLoginDictionary } from '@/internalization/app/dictionaries/login/dictionary';
import { type Locale } from '@/internalization/app/localization';
import LoginWithPassword from './components/LoginWithPassword';
import Logo from './components/Logo';
import { ModeControllerButton } from '../components/ModeContoller';
import { LocaleControllerButton } from '../components/LocaleController';

export default async function Login({ params }: PageProps<'/[lang]/login'>) {
 const { lang } = await params;
 const dic = await getLoginDictionary({
  locale: lang as Locale,
 });

 return (
  <form className='relative m-auto sm:w-[min(100%,30rem)] sm:border border-input sm:p-8 rounded-lg'>
   <div className='hidden sm:flex gap-2 absolute start-0 top-0 p-4'>
    <ModeControllerButton />
    <LocaleControllerButton />
   </div>
   <div>
    <div className='grid place-content-center text-5xl font-medium mb-6'>
     <Logo />
    </div>
    <LoginWithPassword dic={dic} />
   </div>
  </form>
 );
}
