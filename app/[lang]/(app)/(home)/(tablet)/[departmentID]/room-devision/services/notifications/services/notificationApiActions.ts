import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { type Combo } from '../../../utils/apiTypes';

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

export type { InitialData };
export { getEventBoardInitialApi, getInitialData };
