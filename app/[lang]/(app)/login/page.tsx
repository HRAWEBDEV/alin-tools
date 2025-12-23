import { getLoginDictionary } from '@/internalization/app/dictionaries/login/dictionary';
import { type Locale } from '@/internalization/app/localization';
import Login from './components/Login';
import { Metadata } from 'next';

export const generateMetadata = async (
 props: LayoutProps<'/[lang]/login'>,
): Promise<Metadata> => {
 const { lang } = await props.params;
 const loginDic = await getLoginDictionary({ locale: lang as Locale });
 return {
  title: loginDic.title,
 };
};

export default async function LoginPage({
 params,
}: PageProps<'/[lang]/login'>) {
 const { lang } = await params;
 const dic = await getLoginDictionary({
  locale: lang as Locale,
 });
 return <Login dic={dic} />;
}
