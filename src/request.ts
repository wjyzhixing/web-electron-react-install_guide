import { extend } from 'umi-request';

let request: any = extend({
  baseURL: '/',
  headers: {},
  timeout: 6000,
});

request.interceptors.request.use(
  (url: String, options: Record<string, any>) => {
    let token = localStorage.getItem('token') || 'GG';

    // if (token) {
    options.headers = {
      ...options.headers,
      Authorization: 'Bearer' + token,
    };

    return {
      url,
      options,
    };
    // }
  },
);

request.interceptors.response.use(async (response, options) => {
  return response;
});

export default request;

export { request };
