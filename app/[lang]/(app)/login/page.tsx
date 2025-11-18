import { getLoginDictionary } from '@/internalization/app/dictionaries/login/dictionary';
import { type Locale } from '@/internalization/app/localization';
import LoginWithPassword from './components/LoginWithPassword';

export default async function Login({ params }: PageProps<'/[lang]/login'>) {
 const { lang } = await params;
 const dic = await getLoginDictionary({
  locale: lang as Locale,
 });

 return (
  <form className='m-auto w-[min(100%,30rem)] border p-8 rounded-lg'>
   <div className=''>
    <div className='grid place-content-center text-5xl font-medium mb-6'>
     LOGO
    </div>
    <LoginWithPassword dic={dic} />
   </div>
  </form>
 );
}
