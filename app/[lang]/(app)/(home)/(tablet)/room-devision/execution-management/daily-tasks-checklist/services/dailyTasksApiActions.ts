import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { type Combo } from '../../../utils/apiTypes';

interface InitialData {
 roomTypes: Combo[];
 maid: Pick<Maid, 'maidPersonID' | 'fullName' | 'id'>;
 maids: Combo[];
}

interface Maid {
 id: number;
 ownerID: number;
 maidPersonID: number;
 ownerNameID: number;
 ownerName: string;
 name: string;
 middleName: string;
 lastName: string;
 fullName: string;
}

interface CheckList {
 id: number;
 dailyTaskID: number;
 roomID: number;
 sysOccupied: boolean;
 sysReady: boolean;
 sysClean: boolean;
 sysOutOfService: boolean;
 sysOutOfOrder: boolean;
 sysHouseUse: boolean;
 maidOccupied: boolean;
 maidReady: boolean;
 maidClean: boolean;
 maidOutOfService: boolean;
 maidOutOfOrder: boolean;
 maidHouseUse: boolean;
 dnd: boolean;
 sleptOut: boolean;
 lightLuggage: boolean;
 noLuggage: boolean;
 maidID: number;
 confirmUserPersonID: number;
 deleted: boolean;
 timeNo: number;
 closed: boolean;
 roomLabel: string;
 roomTypeID: number;
 maidPersonID: number;
 roomTypeNameID: number;
 roomTypeName: string;
 maidName: string;
 maidMiddleName: string;
 maidLastName: string;
 maidFullName: string;
}

const dailyTasksBaseKey = 'daily-tasks-checklist';

function getInitialData({ signal }: { signal: AbortSignal }) {
 return axios.get<InitialData>('/HouseKeeping/DailyTasksCheckList/GetDatas', {
  signal,
 });
}

function getDailyTasks({
 signal,
 date,
 maidID,
 roomTypeID,
 timeNo,
}: {
 signal: AbortSignal;
 date: string;
 maidID: string;
 roomTypeID?: string;
 timeNo?: string;
}) {
 const searchParams = new URLSearchParams([
  ['date', date],
  ['maidID', maidID],
 ]);
 if (roomTypeID) {
  searchParams.set('roomTypeID', roomTypeID);
 }
 if (timeNo) {
  searchParams.set('timeNo', timeNo);
 }
 return axios.get<CheckList[]>(
  `/HouseKeeping/DailyTasksCheckList/GetDailyTasks?${searchParams.toString()}`,
  { signal },
 );
}

export type { CheckList, InitialData, Maid };
export { dailyTasksBaseKey, getInitialData, getDailyTasks };
