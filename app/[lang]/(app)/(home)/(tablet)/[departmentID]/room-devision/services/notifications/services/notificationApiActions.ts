import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { type Combo, type PagedData } from '../../../utils/apiTypes';

type InitialData = {
 prpgrams: Combo[];
 manegar: boolean;
};

type EventBoard = {
 id: number;
 title: string;
 note: string;
};

const getEventBoardInitialApi = '/Public/EventBoard/GetData';
const getEventBoardApi = '/Public/EventBoard/GetEventBoard';
const saveEventBoardApi = '/Public/EventBoard/SaveEventBoard';
const updateEventBoardApi = '/Public/EventBoard/UpdateEventBoard';
const deleteEventBoardApi = '/Public/EventBoard/RemoveEventBoard';

function getInitialData({ signal }: { signal: AbortSignal }) {
 return axios.get<InitialData>(getEventBoardInitialApi, {
  signal,
 });
}

function getEventBoard({
 limit,
 offset,
 signal,
 programID,
 userID,
}: {
 signal: AbortSignal;
 limit: number;
 offset: number;
 programID?: string;
 userID?: string;
}) {
 const searchParams = new URLSearchParams([
  ['limit', limit.toString()],
  ['offset', offset.toString()],
 ]);
 if (programID) searchParams.append('programID', programID);
 if (userID) searchParams.append('userID', userID);
 return axios.get<PagedData<EventBoard[]>>(getEventBoardApi, {
  signal,
  params: searchParams,
 });
}

export type { InitialData, EventBoard };
export {
 getEventBoardInitialApi,
 getInitialData,
 getEventBoardApi,
 getEventBoard,
};
