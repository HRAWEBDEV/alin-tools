import { getNewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import { Metadata } from 'next';
import { type Locale } from '@/internalization/app/localization';
import NewOrderWrapper from './components/NewOrderWrapper';

export async function generateMetadata({
 params,
}: PageProps<'/[lang]/restaurant/new-order'>): Promise<Metadata> {
 const { lang } = await params;
 const dic = await getNewOrderDictionary({
  locale: lang as Locale,
 });
 return {
  title: dic.title,
 };
}

export default async function NewOrder({
 params,
}: PageProps<'/[lang]/restaurant/new-order'>) {
 const { lang } = await params;
 const dic = await getNewOrderDictionary({
  locale: lang as Locale,
 });
 return <NewOrderWrapper dic={dic} />;
}
