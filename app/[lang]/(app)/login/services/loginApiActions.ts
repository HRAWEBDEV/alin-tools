import { axios } from '../../utils/defaultAxios';

interface LoginWithPasswordCredentials {
 userName: string;
 password: string;
}

interface RecoverPass {
 phoneNumber: string;
 otpCode: number;
 newPassword: string;
 confirmNewPassword: string;
}

function loginWithPassword(credentials: LoginWithPasswordCredentials) {
 return axios.post<{
  // token
  item1: string;
  // token life time
  item2: number;
 }>('/Public/UI/GetJwtToken', credentials);
}

function getForgotPasswordOTP(phoneNo: string) {
 return axios.get<number>(
  `/Public/User/SendForgetPasswordOTPCode?PhoneNumber=${phoneNo}`,
 );
}

function confirmLoginRecoveryWithPassword(newPassDatas: RecoverPass) {
 return axios.put('/Public/User/RecoverPassword', newPassDatas);
}

export type { LoginWithPasswordCredentials, RecoverPass };
export {
 loginWithPassword,
 getForgotPasswordOTP,
 confirmLoginRecoveryWithPassword,
};
