import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { type Combo } from '../../../../restaurant/utils/apiTypes';

type InitialData = {
 items: Combo[];
 programs: Combo[];
 minibarPrograms: Combo[];
 arzs: Combo[];
};

function getInitialData({
 registerID,
 signal,
}: {
 registerID: number;
 signal: AbortSignal;
}) {
 const searchParams = new URLSearchParams([
  ['RegisterID', registerID.toString()],
 ]);
 return axios.get<InitialData>(
  `/Reception/RoomGuestCost/GetInitDatas?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

export type { InitialData };
export { getInitialData };
