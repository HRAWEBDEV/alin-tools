import { type RoomControl } from '../services/roomControlApiActions';

export interface RoomControlProps {
 data?: RoomControl[];
 isFetching: boolean;
 isSuccess: boolean;
 isError: boolean;
 refetch: () => unknown;
}
