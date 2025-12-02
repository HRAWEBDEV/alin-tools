import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';

interface Hall {
 key: string;
 value: string;
}

const getHallKey = 'restaurant-halls';

function getHalls({ signal }: { signal: AbortSignal }) {
 return axios.get<{ halls: Hall[] }>('/Restaurant/Tablet/GetHalls', {
  signal,
 });
}

export { type Hall };
export { getHallKey, getHalls };
