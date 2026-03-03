import { getRoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { RoomsRackConfigProvider } from './services/rooms-rack-config/RoomsRackConfigProvider';
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
 return <RoomsRackConfigProvider dic={dic}>rooms rack</RoomsRackConfigProvider>;
}
