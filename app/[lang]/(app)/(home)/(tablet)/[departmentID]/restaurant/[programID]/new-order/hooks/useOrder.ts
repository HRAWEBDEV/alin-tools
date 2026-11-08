import { useQuery } from '@tanstack/react-query';
import {
 type GetItemProgramsProps,
 getItemProgramsApi,
 getInitialDataApi,
 getOrderApi,
 getInitData,
 getItemPrograms,
 getOrder,
} from '../services/newOrderApiActions';

function useOrderInitialDataQuery() {
 const query = useQuery({
  staleTime: 'static',
  gcTime: 0,
  queryKey: [getInitialDataApi],
  async queryFn({ signal }) {
   const res = await getInitData({ signal });
   return res.data;
  },
 });
 return query;
}

function useItemProgramsQuery({
 enabled,
 props: {
  itemGroupID,
  contractMenuID,
  saleTypeID,
  customerID,
  registerID,
  hasService,
  orderDateTime,
 },
}: {
 enabled: boolean;
 props: Omit<GetItemProgramsProps, 'signal'>;
}) {
 const query = useQuery({
  enabled,
  queryKey: [
   getItemProgramsApi,
   saleTypeID.toString(),
   itemGroupID.toString(),
   orderDateTime.toString(),
   String(hasService),
   contractMenuID?.toString(),
   customerID?.toString(),
   registerID?.toString(),
  ],
  async queryFn({ signal }) {
   const result = await getItemPrograms({
    signal,
    contractMenuID,
    itemGroupID,
    orderDateTime,
    saleTypeID,
    hasService,
    registerID,
    customerID,
   });
   return result.data;
  },
 });
 return query;
}

function useUserOrderQuery({
 enabled,
 props: { orderId },
}: {
 enabled: boolean;
 props: {
  orderId: number;
 };
}) {
 const query = useQuery({
  staleTime: 'static',
  gcTime: 0,
  enabled,
  queryKey: [getOrderApi, orderId?.toString()],
  async queryFn({ signal }) {
   const { data } = await getOrder({ signal, orderID: orderId! });
   return data;
  },
 });
 return query;
}

export { useOrderInitialDataQuery, useItemProgramsQuery, useUserOrderQuery };
