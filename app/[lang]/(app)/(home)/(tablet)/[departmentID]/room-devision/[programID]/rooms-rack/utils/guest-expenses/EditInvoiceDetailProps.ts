import {
 type Invoice,
 type Revenue,
} from '../../services/guest-expenses/guestExpensesApiActions';

export interface EditInvoiceDetailProps {
 invoices: Invoice[];
 showEdit: boolean;
 roomID: number;
 date: string;
 registerID: number;
 costCenterID?: string;
 orderID: Revenue['orderID'];
 selectedInvoiceID: number | null;
 selectedInvoice: Invoice | null;
 onCloseEditInvoice: () => unknown;
 onCloseDetailedInvoice: () => unknown;
 onShowEditInvoice: (id: number | null) => unknown;
 invalidateInvoices: () => unknown;
}
