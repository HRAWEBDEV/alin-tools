import { getExecutionManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/execution-management/dictionary';
import { type Locale } from '@/internalization/app/localization';
import ExecutionManagementWrapper from './components/ExecutionManagementWrapper';
import { getGuestCheckoutChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guest-checkout-checklist/dictionary';

export default async function ExecutionManagementPage(
 props: PageProps<'/[lang]/room-devision/execution-management'>,
) {
 const { lang } = await props.params;
 const dic = await getExecutionManagementDictionary({
  locale: lang as Locale,
 });
 const checkoutCheckListDic = await getGuestCheckoutChecklistDictionary({
  locale: lang as Locale,
 });
 return (
  <ExecutionManagementWrapper
   dic={dic}
   guestChecklistDic={checkoutCheckListDic}
  />
 );
}
