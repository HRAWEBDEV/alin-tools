import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';

interface UserAccessibility {
 restaurant: { newOrder: boolean };
}

const getUserAccessibilityApi = '/Restaurant/Tablet/CheckAccess';

function getUserAccessbility({ signal }: { signal: AbortSignal }) {
 return axios.get<UserAccessibility>(getUserAccessibilityApi, {
  signal,
 });
}

export type { UserAccessibility };
export { getUserAccessibilityApi, getUserAccessbility };
