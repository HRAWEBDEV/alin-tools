import { type CheckList } from '../services/dailyTasksApiActions';

export interface EditDailyTaskProps {
 selectedCheckListID: null | number;
 showNew: boolean;
 onShowEdit: (id: number | null) => unknown;
 onCloseEdit: () => unknown;
 targetEditChecklist: null | CheckList;
}
