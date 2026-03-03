import { type Locale } from '@/internalization/app/localization';
import { getRoomDevisionShareDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/share/dictionary';
import RoomDevisionShareDictionaryProvider from './services/share-dictionary/RoomDevisionShareDictionaryProvider';
import SettingsProvider from './services/profile/settings/SettingsProvider';
import ProfileProvider from './services/profile/ProfileProvider';
import Header from './components/Header';
import Nav from './components/Nav';
import Main from './components/Main';
import Tabs from './components/Tabs';

export default async function HomeLayout({
 children,
 params,
}: LayoutProps<'/[lang]'>) {
 const { lang } = await params;
 const shareDic = await getRoomDevisionShareDictionary({
  locale: lang as Locale,
 });
 return (
  <>
   <RoomDevisionShareDictionaryProvider roomDevisionShareDictionary={shareDic}>
    <SettingsProvider>
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
    </SettingsProvider>
   </RoomDevisionShareDictionaryProvider>
  </>
 );
}
