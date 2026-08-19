import { printNewOrderInvoice } from '../services/newOrderApiActions';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export function useNewOrderPrintInvoice() {
 const { mutate, isPending, isError } = useMutation({
  mutationFn(orderId: number) {
   return printNewOrderInvoice(orderId);
  },
  onSuccess(res) {
   const reportFile = new Blob([res.data], { type: 'application/pdf' });
   const reportFileUrl = URL.createObjectURL(reportFile);
   window.open(reportFileUrl);
  },
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });

 return {
  print: mutate,
  isPending,
  isError,
 };
}
