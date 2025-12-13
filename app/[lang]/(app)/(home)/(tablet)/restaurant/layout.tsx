import { type Locale } from '@/internalization/app/localization';
import Header from './components/Header';
import Nav from './components/Nav';
import Tabs from './components/Tabs';
import Main from './components/Main';
import { getRestaurantShareDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/share/dictionary';
import ResturantShareDictionaryProvider from './services/share-dictionary/RestaurantShareDictionaryProvider';
import ProfileProvider from './services/profile/ProfileProvider';
import 'keen-slider/keen-slider.min.css';

export default async function HomeLayout({
 children,
 params,
}: LayoutProps<'/[lang]'>) {
 const { lang } = await params;
 const shareDic = await getRestaurantShareDictionary({
  locale: lang as Locale,
 });
 return (
  <>
   <ResturantShareDictionaryProvider restaurantShareDictionary={shareDic}>
    <ProfileProvider>
     <div className='h-svh overflow-hidden flex flex-col'>
      <Header />
      <div className='flex grow overflow-hidden'>
       <Nav />
       <Main>{children}</Main>
      </div>
      <Tabs />
     </div>
    </ProfileProvider>
   </ResturantShareDictionaryProvider>
  </>
 );
}
