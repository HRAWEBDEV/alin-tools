import { type BreackfastControlRes } from '../services/BreakfastControlApiActions';

export type BreakfastControlProps = {
 data?: BreackfastControlRes;
 onInvalidateQueries: () => unknown;
 isLoading: boolean;
 isFetching: boolean;
 isError: boolean;
 isSuccess: boolean;
};
