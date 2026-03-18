import { type PagedData } from '../../../utils/apiTypes';
import { type CheckoutChecklist } from '../services/guestCheckoutChecklistApiActions';
import { InfiniteData } from '@tanstack/react-query';

export interface GuestCheckoutProps {
 data?: InfiniteData<PagedData<CheckoutChecklist[]>, unknown>;
 hasNextPage: boolean;
 fetchNextPage: () => unknown;
 isFetching: boolean;
 refetch: () => unknown;
 isSuccess: boolean;
 isError: boolean;
}
