import SalonTableDemo from './SalonTableDemo';
import { motion } from 'motion/react';
import { SalonsConfig } from '../utils/SalonsConfigSetting';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';

const mockTables = [
 {
  tableNo: 1,
  tableCapacity: 4,
  occupiedPerson: 0,
  tableStateTypeID: 1,
  tableTypeID: 1,
  vip: false,
  saleTypeName: '',
  customerName: '',
  OccupiedDateTimeOffset: null,
  orderID: null,
 },
 //  {
 //   tableNo: 2,
 //   tableCapacity: 6,
 //   occupiedPerson: 0,
 //   tableStateTypeID: 2,
 //   tableTypeID: 1,
 //   vip: false,
 //   saleTypeName: '',
 //   customerName: '',
 //   OccupiedDateTimeOffset: null,
 //   orderID: null,
 //  },
 {
  tableNo: 3,
  tableCapacity: 4,
  occupiedPerson: 0,
  tableStateTypeID: 3,
  tableTypeID: 1,
  vip: false,
  saleTypeName: 'سرو در محل',
  customerName: 'علی احمدی',
  OccupiedDateTimeOffset: null,
  orderID: null,
 },
 //  {
 //   tableNo: 4,
 //   tableCapacity: 6,
 //   occupiedPerson: 4,
 //   tableStateTypeID: 4,
 //   tableTypeID: 1,
 //   vip: false,
 //   saleTypeName: 'سرو در محل',
 //   customerName: 'سارا محمدی',
 //   OccupiedDateTimeOffset: new Date().toISOString(),
 //   orderID: 123,
 //  },
 {
  tableNo: 5,
  tableCapacity: 4,
  occupiedPerson: 4,
  tableStateTypeID: 5,
  tableTypeID: 2,
  vip: true,
  saleTypeName: 'سرویس VIP',
  customerName: 'رضا کریمی',
  OccupiedDateTimeOffset: new Date(Date.now() - 30 * 60000).toISOString(),
  orderID: 124,
 },
 //  {
 //   tableNo: 6,
 //   tableCapacity: 8,
 //   occupiedPerson: 6,
 //   tableStateTypeID: 6,
 //   tableTypeID: 1,
 //   vip: false,
 //   saleTypeName: 'سرویس اتاق',
 //   customerName: 'مریم حسینی',
 //   OccupiedDateTimeOffset: new Date(Date.now() - 45 * 60000).toISOString(),
 //   orderID: 125,
 //  },

 //  {
 //   tableNo: 7,
 //   tableCapacity: 8,
 //   occupiedPerson: 0,
 //   tableStateTypeID: 1,
 //   tableTypeID: 1,
 //   vip: false,
 //   saleTypeName: '',
 //   customerName: '',
 //   OccupiedDateTimeOffset: null,
 //   orderID: null,
 //  },
 //  {
 //   tableNo: 8,
 //   tableCapacity: 4,
 //   occupiedPerson: 3,
 //   tableStateTypeID: 4,
 //   tableTypeID: 1,
 //   vip: false,
 //   saleTypeName: 'بیرون بر',
 //   customerName: 'حسین رضایی',
 //   OccupiedDateTimeOffset: new Date(Date.now() - 15 * 60000).toISOString(),
 //   orderID: 126,
 //  },
];

interface SalonTableDemoShowcaseProps {
 mode: SalonsConfig['displayMode'];
 isBold?: boolean;
}

export default function SalonTableDemoShowcase({
 mode,
 isBold,
}: SalonTableDemoShowcaseProps) {
 const { localeInfo } = useBaseConfig();
 return (
  <div dir={localeInfo.contentDirection}>
   <motion.div
    layout
    className={`grid gap-4 justify-center overflow-hidden min-h-56   ${
     mode === 'minimal'
      ? 'grid-cols-[repeat(auto-fill,minmax(6rem,1fr))]'
      : 'grid-cols-[repeat(auto-fill,minmax(11rem,12rem))] sm:grid-cols-[repeat(auto-fill,minmax(11rem,12rem))]'
    }`}
   >
    {mockTables.map((table) => (
     <SalonTableDemo
      key={table.tableNo}
      table={table}
      mode={mode}
      isBold={isBold}
     />
    ))}
   </motion.div>
  </div>
 );
}
