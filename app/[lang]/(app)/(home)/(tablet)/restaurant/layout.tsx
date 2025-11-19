import { type Locale } from '@/internalization/app/localization';
import Main from './components/Main';
import Nav from './components/Nav';
import Tabs from './components/Tabs';
import { getRestaurantShareDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/share/dictionary';
import ResturantShareDictionaryProvider from './services/share-dictionary/RestaurantShareDictionaryProvider';

export default async function HomeLayout({
 children,
 params,
}: LayoutProps<'/[lang]'>) {
 const { lang } = await params;
 const shareDic = await getRestaurantShareDictionary({
  locale: lang as Locale,
 });
 return (
  <ResturantShareDictionaryProvider restaurantShareDictionary={shareDic}>
   <div className='h-svh overflow-hidden flex flex-col'>
    <div className='lg:flex grow overflow-hidden'>
     <Nav />
     <Main>{children}</Main>
    </div>
    <Tabs />
   </div>
  </ResturantShareDictionaryProvider>
 );
}
