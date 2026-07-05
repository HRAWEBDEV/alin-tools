import {
 type Revenue,
 type InitialData,
} from '../../services/guest-expenses/guestExpensesApiActions';

export interface EditStayRevenueProps {
 showEdit: boolean;
 roomID: number;
 registerID: number;
 selectedRevenueID: number | null;
 selectedRevenue: Revenue | null;
 onCloseEditRevenue: () => unknown;
 onShowEditRevenue: (id: number | null) => unknown;
 invalidateRevenues: () => unknown;
 arzs?: InitialData['arzs'];
}
