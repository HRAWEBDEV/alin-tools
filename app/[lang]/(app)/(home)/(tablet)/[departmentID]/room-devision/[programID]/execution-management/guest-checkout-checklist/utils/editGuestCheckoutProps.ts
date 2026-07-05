import { type CheckoutChecklist } from '../services/guestCheckoutChecklistApiActions';

export interface EditGuestCheckoutProps {
 selectedCheckListID: null | number;
 showNew: boolean;
 onShowEdit: (id: number | null) => unknown;
 onCloseEdit: () => unknown;
 targetEditChecklist: null | CheckoutChecklist;
}
