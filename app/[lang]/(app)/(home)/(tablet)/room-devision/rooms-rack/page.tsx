import { getRoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { getRoomStatisticsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/room-statistics/dictionary';
import { getRoomControlDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/room-control/dictionary';
import { RoomsRackConfigProvider } from './services/rooms-rack-config/RoomsRackConfigProvider';
import RoomsRackWrapper from './components/RoomsRackWrapper';
import { type Locale } from '@/internalization/app/localization';
import { Metadata } from 'next';

export async function generateMetadata(
 props: PageProps<'/[lang]/room-devision/rooms-rack'>,
): Promise<Metadata> {
 const { lang } = await props.params;
 const dic = await getRoomsRackDictionary({
  locale: lang as Locale,
 });
 return {
  title: dic.title,
 };
}

export default async function HomePage(
 props: PageProps<'/[lang]/room-devision/rooms-rack'>,
) {
 const { lang } = await props.params;
 const dic = await getRoomsRackDictionary({
  locale: lang as Locale,
 });
 const roomsStatisticsDic = await getRoomStatisticsDictionary({
  locale: lang as Locale,
 });
 const roomControlDic = await getRoomControlDictionary({
  locale: lang as Locale,
 });
 return (
  <RoomsRackConfigProvider dic={dic} roomControlDic={roomControlDic}>
   <RoomsRackWrapper
    dic={dic}
    roomsStatisticsDic={roomsStatisticsDic}
    roomControlDic={roomControlDic}
   />
  </RoomsRackConfigProvider>
 );
}
