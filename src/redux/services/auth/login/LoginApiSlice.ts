import {baseApi} from '../../BaseApiSlice';
import {LoginResponse, LoginApiArgs,FCMArgs} from './types';

// Define a service using a base URL and expected endpoints
export const loginApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.query<LoginResponse, LoginApiArgs>({
      query: payload => ({
        url: `api/login`,
        method: 'POST',
        body: payload,
      }),
    }),
    addFCM: builder.mutation<any, FCMArgs>({
      query: payload => ({
        url: `api/AddFcmToken`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {useLoginQuery, useLazyLoginQuery,useAddFCMMutation} = loginApi;
