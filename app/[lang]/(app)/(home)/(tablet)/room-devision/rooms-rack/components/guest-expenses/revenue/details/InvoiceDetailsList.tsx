import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import { InvoiceDetailProps } from '../../../../utils/guest-expenses/InvoiceDetailProps';
import InvoiceDetailsItem from './InvoiceDetailsItem';

export default function InvoiceDetailsList({
 dic,
 invoiceDetailProps,
}: {
 dic: RoomsRackDictionary;
 invoiceDetailProps: InvoiceDetailProps;
}) {
 if (invoiceDetailProps.isSuccess && !invoiceDetailProps.data?.length) {
  return <NoItemFound />;
 }
 if (!invoiceDetailProps.isFetching && invoiceDetailProps.isError) {
  return <UnExpectedError />;
 }
 return (
  <div className='grow'>
   {invoiceDetailProps.isFetching && <LinearLoading />}
   <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 pb-4'>
    {invoiceDetailProps.data?.map((invoice) => (
     <InvoiceDetailsItem key={invoice.id} dic={dic} invoice={invoice} />
    ))}
   </div>
  </div>
 );
}
