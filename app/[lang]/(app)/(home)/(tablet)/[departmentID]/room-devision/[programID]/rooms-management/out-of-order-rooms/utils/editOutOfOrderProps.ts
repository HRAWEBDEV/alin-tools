import { type Room } from '../services/outOfOrderApiActions';

export interface EditOutOfOrderProps {
 selectedOutOfOrderRoomID: null | number;
 showNew: boolean;
 onShowEdit: (id: number | null) => unknown;
 onCloseEdit: () => unknown;
 targetEditRoom: null | Room;
}
