import { type Invoice } from '../../services/guest-expenses/guestExpensesApiActions';

export interface EditInvoiceDetailProps {
 showEdit: boolean;
 roomID: number;
 registerID: number;
 selectedInvoiceID: number | null;
 selectedInvoice: Invoice | null;
 onCloseEditInvoice: () => unknown;
 onShowEditInvoice: (id: number | null) => unknown;
 invalidateInvoices: () => unknown;
}
