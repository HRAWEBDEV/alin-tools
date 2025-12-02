import { getShareDictionary } from '@/internalization/app/dictionaries/share/dictionary';
import { getMetaDictionary } from '@/internalization/app/dictionaries/meta/dictionary';
import ShareDictionaryProvider from './services/share-dictionary/ShareDictionaryProvider';
import { type Locale, locales } from '@/internalization/app/localization';
import { Toaster } from '@/components/ui/sonner';
import AxiosBaseConfig from './services/axios-base-config/AxiosBaseConfig';

export default async function AppLayout({
 children,
 params,
}: LayoutProps<'/[lang]'>) {
 const { lang } = await params;
 const shareDic = await getShareDictionary({ locale: lang as Locale });
 const metaDic = await getMetaDictionary({ locale: lang as Locale });
 const { contentDirection } = locales[lang as Locale];
 return (
  <ShareDictionaryProvider shareDictionary={shareDic} metaDictionary={metaDic}>
   <AxiosBaseConfig />
   {children}
   <Toaster
    className='font-[inherit]!'
    position={contentDirection === 'rtl' ? 'top-right' : 'top-left'}
    richColors
    closeButton
   />
  </ShareDictionaryProvider>
 );
}
