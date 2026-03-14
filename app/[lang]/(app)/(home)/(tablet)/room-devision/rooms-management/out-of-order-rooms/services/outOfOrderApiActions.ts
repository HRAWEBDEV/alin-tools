import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { Combo } from '../../../utils/apiTypes';

interface InitialData {
 floors: Combo;
 roomTypes: Combo;
 rooms: Combo;
 reasons: Combo;
}

interface Room {
 id: number;
}

const outOfOrderRoomsBaseKey = 'out-of-order-rooms';

function getInitialData({ signal }: { signal: AbortSignal }) {
 return axios.get<InitialData>('/Reception/OutOfOrder/GetDatas', {
  signal,
 });
}

export type { InitialData, Room };
export { outOfOrderRoomsBaseKey, getInitialData };
