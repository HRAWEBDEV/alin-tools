import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import {
 GetSearchQueryValuesResult,
 SetSearchQueryOnPathname,
} from '../../utils/searchQueryValues';
import { type Combo } from '../../../utils/apiTypes';

type InitialData = {
 nationalities: Combo[];
 rooms: Combo[];
 vipGuestTypes: Combo[];
 customers: Combo[];
};

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

type ResidentGuestsData = {
 residentGuests: ResidentGuest[];
 guestsCount: number;
};

const getResidentGuestsInitialData = '/Reception/ResidentGuest/GetDatas';
const getResidentGuestsApi = '/Reception/ResidentGuest/GetResidentGuests';

const getInitDataQueryKey = 'reception-resident-guests-init-data';

const getResidentGuestsQueryKey = 'reception-resident-guests-get-data';

const getInitialData = (signal: AbortSignal) => {
 return axios.get<InitialData>(getResidentGuestsInitialData, {
  signal,
 });
};

function getResidentGuests(
 signal: AbortSignal,
 queryValues: GetSearchQueryValuesResult,
) {
 const pathname = SetSearchQueryOnPathname({
  pathname: getResidentGuestsApi,
  queryValues,
 });
 return axios.get<ResidentGuestsData>(pathname, {
  signal,
 });
}

export type { InitialData, ResidentGuest, ResidentGuestsData };
export {
 getResidentGuestsQueryKey,
 getInitDataQueryKey,
 getInitialData,
 getResidentGuests,
};
