import { axios } from '../../../utils/defaultAxios';

interface User {
 name: string;
 lastName: string;
 personFullName: string;
}

interface Owner {
 id: number;
 name: string;
 departments: Department[];
}

interface Department {
 id: number;
 name: string;
 ownerID: number;
 programs: Program[];
}

interface Program {
 id: number;
 ownerID: number;
 systemID: number;
 systemTypeID: number | null;
 name: string | null;
 systemName: string;
 ownerName: string;
 departmentID: number;
 departmentName: string;
}

interface UserInfoApiResponse {
 value: {
  user: User;
  programs: Program[];
  owners: Record<string, string>;
  departments: Record<string, string>;
  systems: Record<string, string>;
 };
}

interface UserInfoStore {
 user: User;
 owners: Owner[];
}

function convertToUserInfoStore(data: UserInfoApiResponse): UserInfoStore {
 const {
  value: { user: apiUser },
 } = data;
 const user: User = {
  name: apiUser.name,
  lastName: apiUser.lastName,
  personFullName: apiUser.personFullName,
 };
 const owners: Owner[] = [];
 Object.entries(data.value.owners).forEach((value) => {
  const ownerID = Number(value[0]);
  const ownerName = value[1];
  const departments: Department[] = Object.entries(data.value.departments).map(
   (value) => {
    return {
     id: Number(value[0]),
     name: value[1],
     ownerID,
     programs: [],
    };
   },
  );
  departments.forEach((dep) => {
   const newPrograms = data.value.programs.filter(
    (program) => program.departmentID === dep.id && program.ownerID === ownerID,
   );
   dep.programs = newPrograms;
  });
  owners.push({
   id: ownerID,
   name: ownerName,
   departments,
  });
 });
 return {
  user,
  owners,
 };
}

const userInfoBaseKey = 'user-info';
async function getApiUserInfo({ signal }: { signal: AbortSignal }) {
 const res = await axios.get<UserInfoApiResponse>(
  '/Restaurant/Tablet/GetUIDatas',
  {
   signal,
  },
 );
 return res;
}

export type {
 UserInfoApiResponse,
 UserInfoStore,
 User,
 Owner,
 Department,
 Program,
};
export { getApiUserInfo, userInfoBaseKey, convertToUserInfoStore };
