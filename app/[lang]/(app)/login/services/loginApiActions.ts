import { axios } from '../../utils/defaultAxios';

interface LoginWithPasswordCredentials {
 userName: string;
 password: string;
}

function loginWithPassword(credentials: LoginWithPasswordCredentials) {
 return axios.post('/Public/UI/GetJwtToken', credentials);
}

export type { LoginWithPasswordCredentials };
export { loginWithPassword };
