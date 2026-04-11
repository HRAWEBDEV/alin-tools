import { getRoomControlPageDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/room-control/dictionary';
import { getRoomControlDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/room-control/dictionary';
import { type Locale } from '@/internalization/app/localization';
import { Metadata } from 'next';
import RoomControlWrapper from './components/RoomControlWrapper';
// import * as icons from 'react-icons/md';

export async function generateMetadata(
 props: PageProps<'/[lang]/room-devision/rooms-rack'>,
): Promise<Metadata> {
 const { lang } = await props.params;
 const dic = await getRoomControlPageDictionary({
  locale: lang as Locale,
 });
 return {
  title: dic.title,
 };
}

export default async function HomePage(
 props: PageProps<'/[lang]/room-devision/room-control'>,
) {
 const { lang } = await props.params;
 const dic = await getRoomControlPageDictionary({
  locale: lang as Locale,
 });
 const roomControlDic = await getRoomControlDictionary({
  locale: lang as Locale,
 });
 return (
  <div className='p-4'>
   <RoomControlWrapper dic={dic} roomControlDic={roomControlDic} />
  </div>
  // <div className='grid grid-cols-5 gap-4 flex-wrap'>
  //  {Object.keys(icons).map((key) => {
  //   const Icon = icons[key as keyof typeof icons];
  //   return (
  //    <div key={key} className='flex flex-col items-center'>
  //     <Icon className='size-9' />
  //     <p>{key}</p>
  //    </div>
  //   );
  //  })}
  // </div>
 );
}
