import { getShareDictionary } from '@/internalization/app/dictionaries/share/dictionary';
import { getMetaDictionary } from '@/internalization/app/dictionaries/meta/dictionary';
import ShareDictionaryProvider from './services/share-dictionary/ShareDictionaryProvider';
import { type Locale } from '@/internalization/app/localization';
import { Toaster } from '@/components/ui/sonner';

export default async function AppLayout({
 children,
 params,
}: LayoutProps<'/[lang]'>) {
 const { lang } = await params;
 const shareDic = await getShareDictionary({ locale: lang as Locale });
 const metaDic = await getMetaDictionary({ locale: lang as Locale });
 return (
  <ShareDictionaryProvider shareDictionary={shareDic} metaDictionary={metaDic}>
   {children}
   <Toaster position='top-left' richColors closeButton />
  </ShareDictionaryProvider>
 );
}
