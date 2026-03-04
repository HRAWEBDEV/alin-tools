import { type Combo } from '../../utils/apiTypes';
import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';

type InitialData = {
 floors: Combo[];
 buildings: Combo[];
 roomTypes: Combo[];
 roomStateGroups: Combo[];
 roomStateTypes: Combo[];
 roomStateKinds: Combo[];
 roomStateInOutStates: Combo[];
 customers: Combo[];
 racks: Combo[];
 validMinutes: number;
 roomingTime: {
  item1: number;
  item2: number;
 };
};

const roomsRackBaseKey = 'rooms-rack';

function getInitialData({ signal }: { signal: AbortSignal }) {
 return axios.get<InitialData>('/Reception/Rack/GetInitData', {
  signal,
 });
}

export type { InitialData };
export { roomsRackBaseKey, getInitialData };
