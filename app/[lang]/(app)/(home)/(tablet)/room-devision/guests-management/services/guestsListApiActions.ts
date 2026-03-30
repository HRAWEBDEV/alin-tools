import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import {
 GetSearchQueryValuesResult,
 SetSearchQueryOnPathname,
} from '../utils/searchQueryValues';
import { GuestsFilterForm } from '../components/GuestsListWrapper';

type SelectOption = { key: string; value: string };

type SelectOptons = SelectOption[];
type InitialData = {
 nationalities: SelectOptons;
 rooms: SelectOptons;
 vipGuestTypes: SelectOptons;
 customers: SelectOptons;
};
type ApiPagedData<T> = {
 rows: T;
 totalCount: number;
 pageNumber: number;
 pageSize: number;
 nextPage: number | null;
};
// type Guest = {
//  id: number;
//  fullName: string;
//  roomNo?: number;
//  roomLabel?: string;
//  nationalityName?: string | null;
//  folioNo?: number | null;
//  reserveNo?: number;
//  VIPGuestTypeName?: string | null;
//  mobileNo?: string | null;
//  email?: string | null;
// };

type ResidentGuest = {
 id: number;
 registerID: number;
 guestID: number;
 guestTypeID: number | null;
 guestGroupID: number;
 jobID: number | null;
 sourceCityZoneID: number | null;
 targetCityZoneID: number | null;
 sourceCountryZoneID: number | null;
 targetCountryZoneID: number | null;
 travelReasonID: number | null;
 relativeID: number | null;
 visaTypeID: number | null;
 visaNo: string | null;
 visaExpireDate: string | null;
 entranceBorder: string | null;
 entranceDate: string | null;
 travelVehicleID: number | null;
 checkinDateTime: string;
 checkinDateTimeOffset: string;
 checkoutDateTime: string | null;
 registerDepatureDateTimeOffset: string | null;
 sourceCityName: string | null;
 isMaster: boolean;
 isFolioOwner: boolean;
 extraRateTypeID: number;
 userPersonID: number | null;
 deleted: boolean;
 ownerID: number;
 nights: number;
 roomingDateTime: string | null;
 channelID: number | null;
 folioNo: number | null;
 folioName: string | null;
 firstName: string;
 middleName: string | null;
 lastName: string;
 fatherName: string | null;
 birthCityZoneID: number | null;
 birthDate: string | null;
 genderID: number | null;
 genderName: string | null;
 IDCardCityZoneID: number | null;
 IDCardNo: string | null;
 nationalCode: string | null;
 passportNo: string | null;
 personID: number | null;
 religionID: number | null;
 UNCode: string | null;
 officeAddress: string | null;
 homeAddress: string | null;
 employeeCode: number | null;
 guestImageID: number | null;
 uniqueCode: string | null;
 mobileNo: string | null;
 email: string | null;
 folioID: number | null;
 nationalityID: number | null;
 nationalityNameID: number | null;
 nationalityName: string | null;
 VIPGuestTypeID: number | null;
 VIPGuestTypeNameID: number | null;
 VIPGuestTypeName: string | null;
 roomID: number;
 roomNo: number;
 roomLabel: string;
 floorNo: number;
 reserveID: number;
 reserveNo: number;
 customerNameID: number;
 customerName: string | null;
 guestFullName: string | null;
 userPersonName: string | null;
 roomTypeName: string;
 roomTypeID: number;
};

type ResidentGuests = ResidentGuest[];

type ResidentGuestsData = {
 residentGuests: ResidentGuests;
 guestsCount: number;
};

const getResidentGuestsInitialData = '/Reception/ResidentGuest/GetDatas';
const getResidentGuestsApi = '/Reception/ResidentGuest/GetResidentGuests';
const getGuestsApi = '/Reception/ResidentGuest/GetGuests';
const getReportExcelApi = '/Reception/ResidentGuest/GenerateExcelReport';
const getReportPrintApi = '/Reception/ResidentGuest/GenerateReport';

const initDefaults: InitialData = {
 nationalities: [],
 rooms: [],
 vipGuestTypes: [],
 customers: [],
};
const getInitDataQueryKey = 'reception-resident-guests-init-data';

const residentGuestsDefault: ResidentGuestsData = {
 residentGuests: [],
 guestsCount: 0,
};
const getResidentGuestsQueryKey = 'reception-resident-guests-get-data';

const getInitialData = (signal: AbortSignal) => {
 return axios.get<InitialData>(getResidentGuestsInitialData, {
  signal,
 });
};

const getResidentGuests = (
 signal: AbortSignal,
 queryValues: GetSearchQueryValuesResult,
) => {
 const pathname = SetSearchQueryOnPathname({
  pathname: getResidentGuestsApi,
  queryValues,
 });
 return axios.get<ResidentGuestsData>(pathname, {
  signal,
 });
};

let getGuestAbortController: AbortController | undefined;

const getGuests = (filters: GuestsFilterForm, pageParam: number) => {
 getGuestAbortController?.abort();
 getGuestAbortController = new AbortController();

 return axios.get<ApiPagedData<ResidentGuest[]>>(getGuestsApi, {
  params: {
   ...filters,
   pageNumber: pageParam,
  },
  signal: getGuestAbortController.signal,
 });
};
const getReportExcel = (queryValues: GetSearchQueryValuesResult) => {
 const pathname = SetSearchQueryOnPathname({
  queryValues,
  pathname: getReportExcelApi,
 });
 return axios.get<Blob | null>(pathname, {
  responseType: 'blob',
 });
};

const getReportPrint = (queryValues: GetSearchQueryValuesResult) => {
 const pathname = SetSearchQueryOnPathname({
  queryValues,
  pathname: getReportPrintApi,
 });
 return axios.get<Blob>(pathname, {
  responseType: 'blob',
 });
};

export {
 type InitialData as InitialData,
 type ApiPagedData,
 type ResidentGuest as ResidentGuest,
 type ResidentGuests as ResidentGuests,
 //  type Guest as Guest,
 type ResidentGuestsData as ResidentGuestsData,
 getInitialData,
 getResidentGuests,
 getGuests,
 getReportExcel,
 getReportPrint,
 getInitDataQueryKey,
 initDefaults,
 residentGuestsDefault,
 getResidentGuestsQueryKey,
 type SelectOption,
};
