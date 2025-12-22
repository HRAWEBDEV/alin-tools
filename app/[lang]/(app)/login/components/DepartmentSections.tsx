import { Coffee, Utensils } from 'lucide-react';
import {
 DepartmentData,
 useDepartmentContext,
} from '../utils/LoginDepartmentContext';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
type item = [string, string];

function departmentIconMapper(item: item) {
 if (item[0] === '4') return { name: item[1], icon: <Coffee /> };
 if (item[0] === '3') return { name: item[1], icon: <Utensils /> };
}
function handleStoreProgram(
 program: DepartmentData['value']['programs'][number]
): void {
 const ownerid = program.ownerID;
 const departmentid = program.departmentID;
 const systemid = program.systemID;
 localStorage.setItem('Ownerid', ownerid.toString());
 localStorage.setItem('Departmentid', departmentid.toString());
 localStorage.setItem('Programid', program.id.toString());
 localStorage.setItem('Systemid', systemid.toString());
}
export default function DepartmentSections({ item }: { item: item }) {
 const itemObj = departmentIconMapper(item);
 const { department } = useDepartmentContext();
 const filteredDepartmentPrograms = department?.value.programs.filter(
  (program) => program.departmentID === Number(item[0])
 );

 return (
  <div>
   <div className='flex items-center p-4 w-full justify-between border-b border-solid border-gray-400'>
    <span>{itemObj?.name}</span>
    <span>{itemObj?.icon}</span>
   </div>
   <div className='rounded-xl p-4 flex flex-wrap gap-4'>
    {filteredDepartmentPrograms?.map((program) => (
     <Button
      className='rounded-2xl'
      key={nanoid()}
      onClick={() => handleStoreProgram(program)}
     >
      {program.name}
     </Button>
    ))}
   </div>
  </div>
 );
}
