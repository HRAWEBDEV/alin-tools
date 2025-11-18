import { getLoginDictionary } from '@/internalization/app/dictionaries/login/dictionary';
import { Metadata } from 'next';
import { type Locale } from '@/internalization/app/localization';

export async function generateMetadata({
 params,
}: LayoutProps<'/[lang]/login'>): Promise<Metadata> {
 const { lang } = await params;
 const dic = await getLoginDictionary({
  locale: lang as Locale,
 });
 return {
  title: dic.title,
 };
}

export default function LoginLayout({
 children,
}: LayoutProps<'/[lang]/login'>) {
 return <div className='h-svh flex flex-col p-4'>{children}</div>;
}
