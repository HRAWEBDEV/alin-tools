import { type RoomNote } from '../../services/room-notes/RackRoomNotesApiActions';
import { type Paging, type PagedData } from '../../../utils/apiTypes';

export interface RoomNotesProps {
 data?: PagedData<RoomNote[]>;
 paging: Paging;
 rowsCount: number;
 isSuccess: boolean;
 isError: boolean;
 isFetching: boolean;
 refetch: () => unknown;
}
