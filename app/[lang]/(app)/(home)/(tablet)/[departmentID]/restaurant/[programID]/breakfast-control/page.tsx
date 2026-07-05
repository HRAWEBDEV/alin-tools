import { getBreakfastControlDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/breakfastControl/dictionary';
import { Metadata } from 'next';
import { type Locale } from '@/internalization/app/localization';
import BreakfastControlWrapper from './components/BreakfastControlWrapper';

export async function generateMetadata({
 params,
}: PageProps<'/[lang]/[departmentID]/restaurant/[programID]/breakfast-control'>): Promise<Metadata> {
 const { lang } = await params;
 const dic = await getBreakfastControlDictionary({
  locale: lang as Locale,
 });
 return {
  title: dic.title,
 };
}

export default async function BreakfastControlPage({
 params,
}: PageProps<'/[lang]/[departmentID]/restaurant/[programID]/breakfast-control'>) {
 const { lang } = await params;
 const dic = await getBreakfastControlDictionary({
  locale: lang as Locale,
 });
 return <BreakfastControlWrapper dic={dic} />;
}
