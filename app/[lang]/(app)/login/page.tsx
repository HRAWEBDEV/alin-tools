import { getLoginDictionary } from '@/internalization/app/dictionaries/login/dictionary';
import { type Locale } from '@/internalization/app/localization';
import Login from './components/Login';

export default async function LoginPage({
 params,
}: PageProps<'/[lang]/login'>) {
 const { lang } = await params;
 const dic = await getLoginDictionary({
  locale: lang as Locale,
 });
 return <Login dic={dic} />;
}
