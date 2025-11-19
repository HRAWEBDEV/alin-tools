import { getLoginDictionary } from '@/internalization/app/dictionaries/login/dictionary';
import { Metadata } from 'next';
import { type Locale } from '@/internalization/app/localization';
import { ModeControllerButton } from '../components/ModeContoller';
import { LocaleControllerButton } from '../components/LocaleController';
import { AuroraBackground } from '@/components/ui/aurora-background';

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
 return (
  <AuroraBackground>
   <div className='relative h-svh flex flex-col p-4'>
    <div className='flex sm:hidden gap-2 absolute start-0 top-0 p-4'>
     <ModeControllerButton />
     <LocaleControllerButton />
    </div>
    {children}
   </div>
  </AuroraBackground>
 );
}
