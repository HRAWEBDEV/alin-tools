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
 const dic = await getGuestsManagementDictionary({ locale: lang as Locale });
 return { title: dic.title };
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
