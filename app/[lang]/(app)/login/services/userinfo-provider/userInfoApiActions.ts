import { axios } from '../../../utils/defaultAxios';

interface UserInfoApiResponse {
 value: {
  programs: [
   {
    id: number;
    parentID: null | number;
    ownerID: number;
    systemID: number;
    systemTypeID: number | null;
    name: string | null;
    systemRouteMap: string | null;
    systemName: string;
    systemNameID: number;
    ownerName: string;
    ownerNameID: number;
    departmentID: number;
    departmentName: string;
    departmentNameID: number;
   }
  ];
  owners: Record<string, string>;
  departments: Record<string, string>;
  systems: Record<string, string>;
 };
}
type Program = UserInfoApiResponse['value']['programs'][number];
export interface UserCleanInfo {
 owner: string;
 departments: {
  id: string;
  name: string;
  programs: Program[];
 }[];
}

const userInfoBaseKey = 'user-info';
async function getApiUserInfo({ signal }: { signal: AbortSignal }) {
 const res = await axios.get<UserInfoApiResponse>(
  '/Restaurant/Tablet/GetUIDatas',
  {
   signal,
  }
 );
 return res;
}

export type { UserInfoApiResponse };
export { getApiUserInfo, userInfoBaseKey };
