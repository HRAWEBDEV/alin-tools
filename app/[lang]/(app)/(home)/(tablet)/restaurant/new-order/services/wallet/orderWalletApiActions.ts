import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';

interface WalletInfo {
 id: number;
 remainWallet: number;
}

const getWalletInfoApi = '/Public/Cash/GetWalletCredit';

function getWalletInfo({
 signal,
 sValue,
 mobileNo,
 otpCode,
}: {
 signal?: AbortSignal;
 sValue: string;
 mobileNo: string;
 otpCode: string;
}) {
 const searchParams = new URLSearchParams([
  ['sValue', sValue],
  ['mobileNo', mobileNo],
  ['otpCode', otpCode],
 ]);
 return axios.get<WalletInfo>(
  `${getWalletInfoApi}?${searchParams.toString()}`,
  { signal },
 );
}

function sendWalletOtpCode({ mobileNo }: { mobileNo: string }) {
 const searchParams = new URLSearchParams([['mobileNo', mobileNo]]);
 return axios.get(
  `/Public/Cash/SendWalletOTPMessage?${searchParams.toString()}`,
 );
}

export type { WalletInfo };
export { getWalletInfoApi, getWalletInfo, sendWalletOtpCode };
