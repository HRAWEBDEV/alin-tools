import { UserInfoApiResponse } from '@/app/[lang]/(app)/login/services/userinfo-provider/userInfoApiActions';
export function checkInfoStore() {
 const keys = ['Ownerid', 'Departmentid', 'Programid', 'Systemid'];
 const isDepartmentSet = keys.every(
  (item) => localStorage.getItem(item) !== null
 );
 return isDepartmentSet;
}
export function handleAddInfoStore(
 program: UserInfoApiResponse['value']['programs'][number]
): void {
 const ownerid = program.ownerID;
 const departmentid = program.departmentID;
 const systemid = program.systemID;
 localStorage.setItem('Ownerid', ownerid.toString());
 localStorage.setItem('Departmentid', departmentid.toString());
 localStorage.setItem('Programid', program.id.toString());
 localStorage.setItem('Systemid', systemid.toString());
}
