import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { type InitiData } from '../services/salonsApiActions';
import { type SalonBaseConfig } from '../services/salon-base-config/salonBaseConfigContext';

export type TableUtils =
 | {
    tableType: 'normal';
    dic: SalonsDictionary;
    tableTypes: InitiData['tableTypes'];
    multiOrder: InitiData['multiOrder'];
    selectedHall: SalonBaseConfig['hallsInfo']['selectedHall'];
    selectedTable: SalonBaseConfig['tablesInfo']['selectedTable'];
    showTransferTable: SalonBaseConfig['tablesInfo']['showTransferTable'];
    showMergeTable: SalonBaseConfig['tablesInfo']['showMergeTable'];
    changeSelectedTable: SalonBaseConfig['tablesInfo']['changeSelectedTable'];
    onShowChangeTableState: SalonBaseConfig['tablesInfo']['onShowChangeTableState'];
    changeShowTransferTable: SalonBaseConfig['tablesInfo']['changeShowTransferTable'];
    changeShowMergeTable: SalonBaseConfig['tablesInfo']['changeShowMergeTable'];
    mergeTableTo: SalonBaseConfig['tablesInfo']['mergeTableTo'];
    transferTableTo: SalonBaseConfig['tablesInfo']['transferTableTo'];
   }
 | { tableType: 'mock' };
