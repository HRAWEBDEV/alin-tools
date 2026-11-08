import { useQuery } from '@tanstack/react-query';
import { getInitDataApi, getInitData } from '../services/newOrderApiActions';

function useOrderInitialDataQuery() {
 const query = useQuery({
  staleTime: 'static',
  gcTime: 0,
  queryKey: [getInitDataApi],
  async queryFn({ signal }) {
   const res = await getInitData({ signal });
   return res.data;
  },
 });
 return query;
}

export { useOrderInitialDataQuery };
