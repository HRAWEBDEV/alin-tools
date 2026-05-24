import { type Revenue } from '../../services/guest-expenses/guestExpensesApiActions';

export interface EditStayRevenueProps {
 showEdit: boolean;
 selectedRevenueID: number | null;
 selectedRevenue: Revenue | null;
 onCloseEditRevenue: () => unknown;
 onShowEditRevenue: (id: number | null) => unknown;
}
