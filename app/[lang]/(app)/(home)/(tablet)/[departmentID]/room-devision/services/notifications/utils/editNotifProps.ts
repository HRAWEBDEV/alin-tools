import { type EventBoard } from '../services/notificationApiActions';

export type EditNotifProps = {
 showNewNotif: boolean;
 selectedNotfiId: number | null;
 selectedNotif: EventBoard | null;
 onShowEditNotif: (id: number | null) => unknown;
 onCloseEditNotif: () => unknown;
 onInvalidate: () => unknown;
};
