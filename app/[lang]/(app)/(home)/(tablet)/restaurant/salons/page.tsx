import { Metadata } from 'next';
import { getSalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { type Locale } from '@/internalization/app/localization';
import SalonsWrapper from './components/SalonsWrapper';

export async function generateMetadata({
 params,
}: PageProps<'/[lang]/restaurant/salons'>): Promise<Metadata> {
 const { lang } = await params;
 const dic = await getSalonsDictionary({
  locale: lang as Locale,
 });
 return {
  title: dic.title,
 };
}

export default async function Salons({
 params,
}: PageProps<'/[lang]/restaurant/salons'>) {
 const { lang } = await params;
 const dic = await getSalonsDictionary({
  locale: lang as Locale,
 });
 return (
  <>
   <SalonsWrapper dic={dic} />
  </>
 );
}
