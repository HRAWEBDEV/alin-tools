import {
 type Revenue,
 type InitialData,
} from '../../services/guest-expenses/guestExpensesApiActions';

export interface EditInvoiceProps {
 showEdit: boolean;
 roomID: number;
 registerID: number;
 selectedInvoiceID: number | null;
 selectedInvoice: Revenue | null;
 onCloseEditInvoice: () => unknown;
 onShowEditInvoice: (id: number | null) => unknown;
 invalidateInvoices: () => unknown;
 arzs?: InitialData['arzs'];
}
