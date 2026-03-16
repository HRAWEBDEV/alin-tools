import { type Room } from '../services/entranceAndExitApiActions';

export interface EntranceAndExitRoomsProps {
 data?: Room[];
 isFetching: boolean;
 isSuccess: boolean;
 isError: boolean;
 refetch: () => unknown;
}
