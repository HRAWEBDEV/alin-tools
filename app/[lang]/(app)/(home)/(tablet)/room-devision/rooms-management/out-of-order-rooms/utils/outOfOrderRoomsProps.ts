import { type PagedData } from '../../../utils/apiTypes';
import { type OutOfOrderResult } from '../services/outOfOrderApiActions';
import { InfiniteData } from '@tanstack/react-query';

export interface OutOfOrderRoomsProps {
 data?: InfiniteData<OutOfOrderResult, unknown>;
 hasNextPage: boolean;
 fetchNextPage: () => unknown;
 isFetching: boolean;
 refetch: () => unknown;
 isSuccess: boolean;
}
