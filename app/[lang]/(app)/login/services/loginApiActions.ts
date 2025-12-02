import { axios } from '../../utils/defaultAxios';

interface WithPasswordCredentials {
 userName: string;
 password: string;
}

function loginWithPassword(props: WithPasswordCredentials) {
 return axios.post('/Public/UI/GetJwtToken', props);
}

export type { WithPasswordCredentials };
export { loginWithPassword };
