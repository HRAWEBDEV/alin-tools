import {
 type Invoice,
 type Revenue,
} from '../../services/guest-expenses/guestExpensesApiActions';

export interface EditInvoiceDetailProps {
 invoices: Invoice[];
 showEdit: boolean;
 roomID: number;
 registerID: number;
 orderID: Revenue['orderID'];
 selectedInvoiceID: number | null;
 selectedInvoice: Invoice | null;
 onCloseEditInvoice: () => unknown;
 onShowEditInvoice: (id: number | null) => unknown;
 invalidateInvoices: () => unknown;
}
