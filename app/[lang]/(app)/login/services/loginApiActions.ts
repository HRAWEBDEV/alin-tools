import { axios } from '../../utils/defaultAxios';

interface LoginWithPasswordCredentials {
 userName: string;
 password: string;
}

interface RecoverPass {
 phoneNumber: string;
 otpCode: string;
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
 return axios.get<boolean>(
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
