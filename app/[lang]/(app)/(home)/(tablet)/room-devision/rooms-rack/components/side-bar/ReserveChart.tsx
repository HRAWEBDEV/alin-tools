'use client';
import { Pie, PieChart } from 'recharts';
import {
 type ChartConfig,
 ChartContainer,
 ChartTooltip,
 ChartTooltipContent,
} from '@/components/ui/chart';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { useRackConfigContext } from '../../services/rooms-rack-config/roomsRackConfigContext';

export function ReserveChart({ dic }: { dic: RoomsRackDictionary }) {
 const { rackInfo } = useRackConfigContext();
 const chartData = [
  {
   reserveType: 'walkin',
   count: rackInfo.data?.rackReserveInfo.walkin,
   fill: 'var(--color-walkin)',
  },
  {
   reserveType: 'tell',
   count: rackInfo.data?.rackReserveInfo.tell,
   fill: 'var(--color-tell)',
  },
  {
   reserveType: 'website',
   count: rackInfo.data?.rackReserveInfo.website,
   fill: 'var(--color-website)',
  },
  {
   reserveType: 'webService',
   count: rackInfo.data?.rackReserveInfo.webService,
   fill: 'var(--color-webService)',
  },
  {
   reserveType: 'other',
   count: rackInfo.data?.rackReserveInfo.other,
   fill: 'var(--color-other)',
  },
 ] as const;

 const chartConfig = {
  count: {
   label: 'count',
  },
  walkin: {
   label: dic.info.walkin,
   color: '#0284c7',
  },
  tell: {
   label: dic.info.tell,
   color: '#ea580c',
  },
  website: {
   label: dic.info.website,
   color: '#104e64',
  },
  webService: {
   label: dic.info.webService,
   color: '#f0b100',
  },
  other: {
   label: dic.info.other,
   color: '#a1a1a1',
  },
 } satisfies ChartConfig;

 return (
  <div className='flex flex-col'>
   <div className='flex-1 pb-0'>
    <ChartContainer
     config={chartConfig}
     className='mx-auto aspect-square max-h-40'
    >
     <PieChart>
      <ChartTooltip
       content={<ChartTooltipContent nameKey='reserveType' hideLabel />}
      />
      <Pie data={chartData} dataKey='count'></Pie>
     </PieChart>
    </ChartContainer>
    <div className='grid grid-cols-2 gap-1 gap-y-2'>
     {chartData.map((legend) => (
      <div key={legend.reserveType} className='flex items-center gap-1'>
       <div
        style={{
         backgroundColor: chartConfig[legend.reserveType].color,
        }}
        className='h-4 w-4 rounded-[4px] shrink-0'
       ></div>
       <p className='text-sm text-neutral-700 dark:text-neutral-400 font-medium'>
        {chartConfig[legend.reserveType].label} <span>({legend.count})</span>
       </p>
      </div>
     ))}
    </div>
   </div>
  </div>
 );
}
