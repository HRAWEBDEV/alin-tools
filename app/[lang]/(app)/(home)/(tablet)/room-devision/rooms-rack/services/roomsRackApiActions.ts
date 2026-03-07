import { URLSearchParams } from 'url';
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

interface RackInfo {
 occupied: number;
 vacent: number;
 readyToService: number;
 waiteForService: number;
 waiteForQC: number;
 outOfOrder: number;
 todayCheckin: number;
 todayCheckedin: number;
 notCheckin: number;
 todayCheckout: number;
 todayCheckedout: number;
 notCheckout: number;
 guestCout: number;
 extraBed: number;
 rackReserveInfo: {
  walkin: number;
  tell: number;
  website: number;
  webService: number;
  other: number;
 };
 gaugeChart: {
  min: number;
  max: number;
  value: number;
  rate: number;
  title: string;
 };
}

const roomsRackBaseKey = 'rooms-rack';

function getInitialData({ signal }: { signal: AbortSignal }) {
 return axios.get<InitialData>('/Reception/Rack/GetInitData', {
  signal,
 });
}

function getRackInfo({ date, signal }: { signal: AbortSignal; date: string }) {
 const searchParams = new URLSearchParams([['date', date]]);
 return axios.get(`/Reception/Rack/GetRackInfo?${searchParams.toString()}`, {
  signal,
 });
}

export type { InitialData, RackInfo };
export { roomsRackBaseKey, getInitialData, getRackInfo };
