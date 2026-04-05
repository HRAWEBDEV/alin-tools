import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';

interface WalletInfo {
 id: number;
 personFrisName: string;
 personLatName: string;
 remainWallet: number;
}

const walletBaseKey = 'restaurant-wallet';

function getWalletInfo({
 signal,
 mobileNo,
 nationalCode,
 sValue,
}: {
 signal?: AbortSignal;
 sValue: string;
 mobileNo: string;
 nationalCode: string;
}) {
 const searchParams = new URLSearchParams([['sValue', sValue]]);
 if (mobileNo) {
  searchParams.set('MobileNo', mobileNo);
 }
 if (nationalCode) {
  searchParams.set('NationalCode', nationalCode);
 }
 return axios.get<WalletInfo>(
  `/Public/Cash/GetWalletCredit?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

function sendWalletOTP({
 walletID,
 mobileNo,
 nationalCode,
}: {
 walletID: string;
 mobileNo: string;
 nationalCode: string;
}) {
 const searchParams = new URLSearchParams([['WalletID', walletID]]);
 if (mobileNo) {
  searchParams.set('MobileNo', mobileNo);
 }
 if (nationalCode) {
  searchParams.set('NationalCode', nationalCode);
 }
 return axios.get<WalletInfo>(
  `/Public/Cash/SendWalletOTPMessage?${searchParams.toString()}`,
 );
}

export type { WalletInfo };
export { walletBaseKey, getWalletInfo, sendWalletOTP };
