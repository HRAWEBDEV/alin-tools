import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { type CrudAccess } from '@/app/[lang]/(app)/(home)/(tablet)/room-devision/utils/apiTypes';

interface UserAccessibility {
 restaurant: {
  order: {
   close: boolean;
   payment: boolean;
   changeCustomer: boolean;
   changeDiscount: boolean;
  } & CrudAccess;
  orderItem: CrudAccess;
  table: {
   change: boolean;
   merge: boolean;
  };
 };
}

const getUserAccessibilityApi = '/Restaurant/Tablet/CheckAccess';

function getUserAccessbility({ signal }: { signal: AbortSignal }) {
 return axios.get<UserAccessibility>(getUserAccessibilityApi, {
  signal,
 });
}

export type { UserAccessibility };
export { getUserAccessibilityApi, getUserAccessbility };
