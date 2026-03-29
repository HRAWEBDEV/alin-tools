import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';

interface RoomGuest {
 id: number;
 registerID: number;
 guestTypeID: number | null;
 roomID: number | null;
 roomLabel: string | null;
 folioNo: number | null;
 folioID: number | null;
 jobID: number | null;
 sourceCityZoneID: number | null;
 targetCityZoneID: number | null;
 sourceCountryZoneID: number | null;
 targetCountryZoneID: number | null;
 sourceCityName: string | null;
 targetCityName: string | null;
 sourceCountryName: string | null;
 targetCountryName: string | null;
 travelReasonID: number | null;
 travelReasonName: string | null;
 relativeID: number | null;
 relativeName: string | null;
 visaTypeID: number | null;
 visaNo: string | null;
 visaExpireDateTimeOffset: string | null;
 entranceBorder: string | null;
 travelVehicleID: number | null;
 travelVehicleName: string | null;
 checkinDateTimeOffset: string;
 checkoutDateTimeOffset: string | null;
 isFolioOwner: boolean;
 extraRateTypeID: number;
 extraRateTypeName: string;
 firstName: string;
 middleName: string | null;
 lastName: string;
 fatherName: string | null;
 birthCityZoneID: number | null;
 birthDateTimeOffset: string | null;
 genderID: number | null;
 genderName: string | null;
 idCardNo: string | null;
 mobileNo: string | null;
 email: string | null;
 nationalCode: string | null;
 passportNo: string | null;
 officeAddress: string | null;
 homeAddress: string | null;
 nationalityID: number | null;
 nationalityName: string | null;
 isMaster: boolean;
 idCardCityZoneID: number | null;
 registerDepature: string;
}

const roomGuestsBaseKey = 'rack-room-guests';

function getRoomGuests({
 signal,
 registerId,
}: {
 signal: AbortSignal;
 registerId: number;
}) {
 const searchParams = new URLSearchParams([
  ['RegisterID', registerId.toString()],
 ]);
 return axios.get<RoomGuest[]>(
  `/Reception/RegisterGuest/GetRegisterGuests?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

export type { RoomGuest };
export { roomGuestsBaseKey, getRoomGuests };
