import { type CheckList } from '../services/dailyTasksApiActions';

export interface DailyTasksChecklistProps {
 data?: CheckList[];
 isFetching: boolean;
 refetch: () => unknown;
 isSuccess: boolean;
 isError: boolean;
}
