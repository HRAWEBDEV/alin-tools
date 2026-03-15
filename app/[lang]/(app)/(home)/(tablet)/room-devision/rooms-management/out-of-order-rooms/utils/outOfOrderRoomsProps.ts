import { type PagedData } from '../../../utils/apiTypes';
import { type Room } from '../services/outOfOrderApiActions';
import { InfiniteData } from '@tanstack/react-query';

export interface OutOfOrderRoomsProps {
 data?: InfiniteData<PagedData<Room[]>, unknown>;
 hasNextPage: boolean;
 fetchNextPage: () => unknown;
 isFetching: boolean;
 refetch: () => unknown;
 isSuccess: boolean;
}
