import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { Combo } from '../../../utils/apiTypes';

interface InitialData {
 floors: Combo[];
 roomTypes: Combo[];
}

const entranceAndExitBaseKey = 'entrance-and-exit-rooms';

function getInitialData({ signal }: { signal: AbortSignal }) {
 return axios.get<InitialData>('/Reception/CheckInCheckOutRooms/GetDatas', {
  signal,
 });
}

export type { InitialData };
export { entranceAndExitBaseKey, getInitialData };
