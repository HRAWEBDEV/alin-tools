import { useRestaurantShareDictionary } from '../../../share-dictionary/restaurantShareDictionaryContext';
import SalonTableDemo from './SalonTableDemo';

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
 {
  tableNo: 2,
  tableCapacity: 6,
  occupiedPerson: 0,
  tableStateTypeID: 2,
  tableTypeID: 1,
  vip: false,
  saleTypeName: '',
  customerName: '',
  OccupiedDateTimeOffset: null,
  orderID: null,
 },
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
 {
  tableNo: 4,
  tableCapacity: 6,
  occupiedPerson: 4,
  tableStateTypeID: 4,
  tableTypeID: 1,
  vip: false,
  saleTypeName: 'سرو در محل',
  customerName: 'سارا محمدی',
  OccupiedDateTimeOffset: new Date().toISOString(),
  orderID: 123,
 },
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
 {
  tableNo: 6,
  tableCapacity: 8,
  occupiedPerson: 6,
  tableStateTypeID: 6,
  tableTypeID: 1,
  vip: false,
  saleTypeName: 'سرویس اتاق',
  customerName: 'مریم حسینی',
  OccupiedDateTimeOffset: new Date(Date.now() - 45 * 60000).toISOString(),
  orderID: 125,
 },

 {
  tableNo: 7,
  tableCapacity: 8,
  occupiedPerson: 0,
  tableStateTypeID: 1,
  tableTypeID: 1,
  vip: false,
  saleTypeName: '',
  customerName: '',
  OccupiedDateTimeOffset: null,
  orderID: null,
 },
 {
  tableNo: 8,
  tableCapacity: 4,
  occupiedPerson: 3,
  tableStateTypeID: 4,
  tableTypeID: 1,
  vip: false,
  saleTypeName: 'بیرون بر',
  customerName: 'حسین رضایی',
  OccupiedDateTimeOffset: new Date(Date.now() - 15 * 60000).toISOString(),
  orderID: 126,
 },
];

export default function SalonTableDemoShowcase() {
 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();

 const dic = settings.components.tablesDisplayMode.demo;

 return (
  <div dir='rtl'>
   <h1 className='text-3xl font-bold mb-8 text-center'>{dic.title}</h1>

   <div className='grid gap-4 grid-cols-[repeat(auto-fill,minmax(9rem,10rem))] sm:grid-cols-[repeat(auto-fill,minmax(9rem,10rem))] justify-center'>
    {mockTables.map((table) => (
     <SalonTableDemo key={table.tableNo} table={table} />
    ))}
   </div>
  </div>
 );
}
