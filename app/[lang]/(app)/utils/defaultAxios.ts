import axios from 'axios';

const defaultAxios = axios.create({
 baseURL: process.env.NEXT_PUBLIC_API_URI,
});

export { defaultAxios as axios };
