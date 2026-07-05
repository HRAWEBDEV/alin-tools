import { useUserInfoRouter } from '@/app/[lang]/(app)/login/services/userinfo-provider/UserInfoRouterContext';
import { type Table } from '../services/salonsApiActions';
import { TableUtils } from '../utils/tableUtils';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';

export function useOrderRedirectLink({
 table,
 tableUtils,
}: {
 table: Table;
 tableUtils: TableUtils;
}) {
 const { routeDepartment, routeProgram } = useUserInfoRouter();
 const { locale } = useBaseConfig();
 return tableUtils.tableType === 'mock'
  ? ''
  : (`/${locale}/${routeDepartment.id}/restaurant/${routeProgram.id}/new-order?salonID=${tableUtils.selectedHall?.key}&salonName=${tableUtils.selectedHall?.value}&tableID=${table.tableID}&tableNo=${table.tableNo}&fromSalons=true` as const);
}
