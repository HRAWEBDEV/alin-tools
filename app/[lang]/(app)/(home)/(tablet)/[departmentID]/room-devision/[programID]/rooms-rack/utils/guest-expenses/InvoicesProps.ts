import { type Revenue } from '../../services/guest-expenses/guestExpensesApiActions';

export interface InvoicesProps {
 data?: Revenue[];
 isSuccess: boolean;
 isLoading: boolean;
 isError: boolean;
 isFetching: boolean;
 refetch: () => unknown;
}
