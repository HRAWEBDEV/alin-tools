import { type Revenue } from '../../services/guest-expenses/guestExpensesApiActions';

export interface StayRevenueProps {
 data?: Revenue[];
 isSuccess: boolean;
 isLoading: boolean;
 isError: boolean;
 isFetching: boolean;
 refetch: () => unknown;
}
