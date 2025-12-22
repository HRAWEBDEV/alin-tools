import { getLoginDictionary } from '@/internalization/app/dictionaries/login/dictionary';
import { type Locale } from '@/internalization/app/localization';
import { Metadata } from 'next';

export const generateMetadata = async (
 props: LayoutProps<'/[lang]/login'>,
): Promise<Metadata> => {
 const { lang } = await props.params;
 const loginDic = await getLoginDictionary({ locale: lang as Locale });
 return {
  title: loginDic.login.forgetPassword.title,
 };
};

export default async function ForgetPassword(
 props: LayoutProps<'/[lang]/login'>,
) {
 const { lang } = await props.params;
 const loginDic = await getLoginDictionary({ locale: lang as Locale });
 return <div></div>;
}
