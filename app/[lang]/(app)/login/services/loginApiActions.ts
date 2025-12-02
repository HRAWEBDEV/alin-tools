import { axios } from '../../utils/defaultAxios';

interface LoginWithPasswordCredentials {
 userName: string;
 password: string;
}

function loginWithPassword(credentials: LoginWithPasswordCredentials) {
 return axios.post<{
  // token
  item1: string;
  // token life time
  item2: number;
 }>('/Public/UI/GetJwtToken', credentials);
}

export type { LoginWithPasswordCredentials };
export { loginWithPassword };
