import { motion } from 'motion/react';
import { type SalonsConfig } from '../../utils/SalonsConfigSetting';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import SalonTable from '../../../../../salons/components/SalonTable';
import { generateTableMockData } from '../../../../../salons/services/salonsApiActions';
import { useSettingsContext } from '../../settingsContext';

interface SalonTableDemoShowcaseProps {
 mode: SalonsConfig['displayMode'];
}

export default function SalonTableDemoShowcase({
 mode,
}: SalonTableDemoShowcaseProps) {
 const { localeInfo } = useBaseConfig();
 const {
  salonsConfigSetup: { salonsConfig },
 } = useSettingsContext();
 return (
  <div dir={localeInfo.contentDirection}>
   <motion.div
    className={`grid gap-4 overflow-hidden ${
     mode === 'minimal'
      ? 'grid-cols-[repeat(auto-fill,minmax(6rem,1fr))]'
      : 'grid-cols-[repeat(auto-fill,minmax(11rem,12rem))] sm:grid-cols-[repeat(auto-fill,minmax(11rem,12rem))]'
    }`}
   >
    {[1, 2, 3].map((table, i) => {
     const tableMockData = generateTableMockData({
      tableCapacity: i + 2,
      tableNo: i + 1,
      vip: i === 1,
      tableStateTypeID: i + 1,
      occupiedPerson: i + 1,
     });
     return (
      <SalonTable
       key={table}
       table={tableMockData}
       isBold={salonsConfig.boldStyle}
       tableType='mock'
       isMinimal={salonsConfig.displayMode === 'minimal'}
      />
     );
    })}
   </motion.div>
  </div>
 );
}
