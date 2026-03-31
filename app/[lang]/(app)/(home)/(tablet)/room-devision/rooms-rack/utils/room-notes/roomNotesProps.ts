import { type RoomNote } from '../../services/room-notes/RackRoomNotesApiActions';
import { type Paging, type PagedData } from '../../../utils/apiTypes';
import { Dispatch, SetStateAction } from 'react';

export interface RoomNotesProps {
 data?: PagedData<RoomNote[]>;
 paging: Paging;
 setPaging: Dispatch<SetStateAction<Paging>>;
 rowsCount: number;
 isSuccess: boolean;
 isError: boolean;
 isFetching: boolean;
 refetch: () => unknown;
}
