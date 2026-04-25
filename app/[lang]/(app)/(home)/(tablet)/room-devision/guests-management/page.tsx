import { getGuestsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-management/dictionary';
import { type Locale } from '@/internalization/app/localization';
import GuestsMangementWrapper from './components/GuestsMangementWrapper';
import { Metadata } from 'next';
import { getResidentGuestsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/resident-guests/dictionary';
import { getArrivalReservesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/arrival-reserves/dictionary';
import { getGuestsExpensesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-expenses/dictionary';

export const generateMetadata = async (
 props: PageProps<'/[lang]/room-devision/guests-management'>,
): Promise<Metadata> => {
 const { lang } = await props.params;
 const { tab } = (await props.searchParams) ?? {};
 const dic = await getGuestsManagementDictionary({ locale: lang as Locale });

 const tabTitles: Record<string, string> = {
  'guests-list': dic.tabs.guestsList,
  'arrival-reserves': dic.tabs.arrivalReserves,
  'guests-expenses': dic.tabs.guestsExpenses,
 };

 const tabTitle = typeof tab === 'string' ? tabTitles[tab] : undefined;

 return { title: !tabTitle ? dic.title : `${dic.title} | ${tabTitle}` };
};

export default async function page(
 props: PageProps<'/[lang]/room-devision/guests-management'>,
) {
 const { lang } = await props.params;
 const guestsManagementDic = await getGuestsManagementDictionary({
  locale: lang as Locale,
 });
 const residentGuestsDic = await getResidentGuestsDictionary({
  locale: lang as Locale,
 });
 const arrivalReservesDic = await getArrivalReservesDictionary({
  locale: lang as Locale,
 });
 const guestsExpensesDic = await getGuestsExpensesDictionary({
  locale: lang as Locale,
 });
 return (
  <GuestsMangementWrapper
   dic={guestsManagementDic}
   residentGuestsDic={residentGuestsDic}
   arrivalReservesDic={arrivalReservesDic}
   guestsExpensesDic={guestsExpensesDic}
  />
 );
}
