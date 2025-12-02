import { getLoginDictionary } from '@/internalization/app/dictionaries/login/dictionary';
import LoginWithPassword from './components/LoginWithPassword';
import LoginOptions from './components/LoginOptions';
import { type Locale } from '@/internalization/app/localization';

export default async function Login({ params }: PageProps<'/[lang]/login'>) {
 const { lang } = await params;
 const dic = await getLoginDictionary({
  locale: lang as Locale,
 });
 return (
  <div>
   <LoginWithPassword dic={dic} />
   <LoginOptions dic={dic} />
  </div>
 );
}
