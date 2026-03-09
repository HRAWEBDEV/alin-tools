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

type Rack = {
 roomID: number;
 roomTypeID: number;
 registerStateID: number;
 dateDateTimeOffset: string;
 msgFlag: boolean;
 noRoom: boolean;
 roomStateTypeID: number;
 roomStateKindID: number;
 roomStateGroupID: number;
 guestCount: number | null;
 roomInOutStateID: number | null;
 registerID: number | null;
 reserveID: number | null;
 DateTimeDateOffset: string;
 roomLabel: string;
 roomNo: number;
 floorNo: number;
 folioID: number;
 folioNo: number;
 buildingNo: number;
 sortNo: number;
 roomTypeName: string | null;
 roomStateGroupName: string | null;
 roomStateTypeName: string | null;
 roomStateKindName: string | null;
 roomInOutStateName: string | null;
 customerColor: string | null;
 customerID: number | null;
 customerName: string | null;
 guestName: string | null;
 guestLastName: string | null;
 checkinDateTimeOffset: string | null;
 depatureDateTimeOffset: string | null;
 roomTypeAliasName: string | null;
 reserveNo: number | null;
 bookerName: string | null;
 reserveArrival: string | null;
 reserveDeparture: string | null;
 arzID: number | null;
 ratePlanID: number | null;
 nights: number | null;
 arrivalDateTimeOffset: string | null;
 houseUse: boolean | null;
 lateCheckout: boolean | null;
 earlyCheckin: boolean | null;
 boardID: number | null;
 dayUse: boolean;
 carFlag: boolean;
 complimentaryID: number | null;
};

type RackDetails = {
 guestCount: number;
 occupieds: number;
 outOfOrder: number;
 outOfServices: number;
 readies: number;
 vacents: number;
 reserveCount: number;
};

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

function changeRoomStateKind({
 roomID,
 date,
 stateKind,
}: {
 roomID: number;
 date: string;
 stateKind: number;
}) {
 const searchParams = new URLSearchParams([
  ['Date', date],
  ['RoomID', roomID.toString()],
  ['Kind', stateKind.toString()],
 ]);
 return axios.get(
  `/Reception/ChangeRoomStateKind/SaveState?${searchParams.toString()}`,
 );
}

function changeRoomStateType({
 roomID,
 date,
 stateType,
}: {
 roomID: number;
 date: string;
 stateType: number;
}) {
 const searchParams = new URLSearchParams([
  ['Date', date],
  ['RoomID', roomID.toString()],
  ['TypeID', stateType.toString()],
 ]);
 return axios.get(
  `/Reception/ChangeRoomStateType/SaveState?${searchParams.toString()}`,
 );
}

export type { InitialData, RackInfo, Rack, RackDetails };
export {
 roomsRackBaseKey,
 getInitialData,
 getRackInfo,
 changeRoomStateKind,
 changeRoomStateType,
};
