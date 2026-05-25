import { type Invoice } from '../../services/guest-expenses/guestExpensesApiActions';

export interface InvoiceDetailProps {
 data?: Invoice[];
 isSuccess: boolean;
 isLoading: boolean;
 isError: boolean;
 isFetching: boolean;
 refetch: () => unknown;
}
